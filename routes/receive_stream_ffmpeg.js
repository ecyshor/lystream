/**
 * Created by nreut on 11-Jun-14.
 */
var express = require('express');
var router = express.Router();
var FFmpeg = require('fluent-ffmpeg');
var HashMap = require('hashmap').HashMap;

var VideoBuffer = require('../util/VideoBuffer');
var streamMap = new HashMap;
var count = 0;
router.get('/:id/mpd', function (req, res) {
    if (streamMap.has(req.param('id'))) {
        res.write(streamMap.get(req.param('id')).mpd.toString());
        res.end();
    }
    else {
        res.status(404);
        res.end();
    }
});
router.post('/:id/*', function (req, res) {
    console.log('Source: Starting stream ' + req.param('id'));
    console.log(req.headers);
    var vidBuf;
    if (!streamMap.has(req.param('id'))) {
        vidBuf = new VideoBuffer(120000000, req.param('id'));
        streamMap.set(req.param('id'), vidBuf);
    } else {
        vidBuf = streamMap.get(req.param('id'));
    }
    var segmentLength = 0;
    req.on('data', function (data) {
        console.log('Source: Receiving data for stream ' + req.param('id') + ' with length ' + data.length);
        segmentLength += data.length;
        vidBuf.append(data);
    });
    req.on('end', function () {
        console.log('Source: Terminating segment for stream with id: ' + req.param('id'));
        vidBuf.updateMPD(segmentLength);
        res.end();
    })
});
router.get('/', function (req, res) {
    console.log('Client: Incoming request for stream ' + req.param('id') + ' with range ' + req.get('range'));
    var range = req.header('range');
    console.log(range);
    if (!(typeof range === 'undefined')) {
        var positions = range.replace('bytes=', '').split('-');
        var start = parseInt(positions[0], 10);
        var end = parseInt(positions[1].split('/')[0], 10);
    }
    else {
        start = 0;
        end = 49999;
    }
    if (isNaN(end)) {
        end = 50000;
    }
    if (streamMap.has(req.param('id'))) {
        var noClient = count++;
        var bufferStream = streamMap.get(req.param('id'));
        res.status(206).set(
            {
                'Connection': 'keep-alive',
                'Content-Range': 'bytes ' + start + '-' + bufferStream.bufferList.length + '/' + bufferStream.bufferList.length,//bufferStream.startingIndex + bufferStream.bufferList.length + 1,
                'Content-Type': 'video/webm',
                'Accept-Ranges': 'bytes',
                'Transfer-Encoding': 'chunked',
                'Content-Length': end - start
            });
        console.log('Client: Getting stream and piping to client with id: ' + noClient + ' for stream with id ' + req.param('id'));
        res.write(bufferStream.slice(start), 'binary');
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
    }
});


module.exports = router;