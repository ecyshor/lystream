/**
 * Created by nreut on 11-Jun-14.
 */
var express = require('express');
var router = express.Router();
var HashMap = require('hashmap').HashMap;

var VideoBuffer = require('../util/VideoBuffer');
var streamMap = new HashMap;
router.get('/:id/mpd', function (req, res) {
    if (streamMap.has(req.param('id'))) {
        res.set({'Content-Type': 'application/xml'});
        res.write(streamMap.get(req.param('id')).getMPD());
        res.end();
    }
    else {
        res.status(404);
        res.end();
    }
});
router.post('/:id/*', function (req, res) {
    console.log('Source: Starting stream ' + req.param('id'));
    var vidBuf;
    if (!streamMap.has(req.param('id'))) {
        vidBuf = new VideoBuffer(req.param('id'));
        streamMap.set(req.param('id'), vidBuf);
    } else {
        vidBuf = streamMap.get(req.param('id'));
    }
    var segmentLength = 0;
    req.on('data', function (data) {
        segmentLength += data.length;
        vidBuf.append(data);
    });
    req.on('end', function () {
        console.log('Source: Terminating segment for stream with id: ' + req.param('id'));
        vidBuf.updateMPD(segmentLength);
        res.end();
    })
});
router.head('/:id/:segmentNo', function (req, res) {
    console.log('Head: Requesting segment number ' + req.param('segmentNo') + ' for stream with id ' + req.param('id'));
    console.log('\tHead: Segment from stream with length ' + streamMap.get(req.param('id')).getSegmentData(req.param('segmentNo')).length);
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': streamMap.get(req.param('id')).getSegmentData(req.param('segmentNo')).length
        //'Content-Range': streamMap.get(req.param('id')).getSegmentRange(req.param('segmentNo'))
    });
    res.end();
});


router.get('/:id/:segmentNo', function (req, res) {
    console.log('Getting segment ' + req.param('segmentNo') + ' for stream ' + req.param('id'));
    if (streamMap.has(req.param('id'))) {
        var bufferStream = streamMap.get(req.param('id'));
        console.log('\t Buffer Stream ' + bufferStream);
        res.set(
            {
                'Connection': 'keep-alive',
                'Content-Type': 'video/webm',
                'Accept-Ranges': 'bytes',
                'Transfer-Encoding': 'chunked',
                'Content-Length': bufferStream.getSegmentData(req.param('segmentNo')).length,
            });
        console.log('Client: Getting stream and piping for stream with id ' + req.param('id'));
        res.write(bufferStream.getSegmentData(req.param('segmentNo')), 'binary');
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
    }
});

router.get('/:id', function (req, res) {
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': '432',
        'Content-Range': '0-431/432'
    });
    res.write(streamMap.get(req.param('id')).bufferList.slice(0, 432));
    res.end();
});

module.exports = router;