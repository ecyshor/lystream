/**
 * Created by Nicu on 08/10/2014.
 */
var router = require('express').Router(),
    Stream = require('../util/models/stream'),
    Account = require('../util/models/account'),
    log = require('debug')('lystream:streamApi'),
    streamingService = require('../util/StreamingService').StreamingService;
    //streamingService = new StreamingService();
    const streamId = 'streamId';
/*Return the user's streams*/
router.get('/', function (req, res) {
    Account
        .findOne({ _id: req.user._id })
        .populate('streams')
        .exec(function (err, account) {
            if (err) {
                log('Error retrieving user streams ' + err);
                res.json(500, err);
            }
            log('Retrieved user streams ');
            res.status(200).json(account.streams);
            res.end();
        });
});
/*Create a new stream for the user*/
router.post('/', function (req, res) {
    log('Creating stream with information ' + JSON.stringify(req.body.stream) + ' for user ' + req.user);
    Stream.create({
        name: req.body.stream.name,
        description: req.body.stream.description,
        _creator: req.user._id
    }, function (err, streamDoc) {
        if (err) {
            log('Error in creating document ' + err);
            res.status(400).json(err);
            res.end();
        }
        log('Created document ' + streamDoc);
        req.user.streams.push(streamDoc);
        req.user.save(function (err, user, numberAffected) {
            if (err) {
                log('Error saving stream in the user field.');
            }
        });
        res.status(201).json(streamDoc);
        res.end();
    });
});


/*Upload*/
router.post('/:streamSecretId/*', function (req, res) {
    var query = Stream.where({ uploadSecretPassKey: req.param('streamSecretId') });
    query.findOne(function (err, stream) {
            if (err) {
                log('Error retrieving stream for upload');
                res.status(500).json(err);
                res.end();
            }else{
            if (stream !== null) {
                log('Retrieved user stream with secret and id ');
                log('Source: Starting stream ' + stream.id);
                var vidBuf = streamingService.getVideoBufferForStream(stream.id);

                var segmentLength = 0;
                req.on('data', function (data) {
                    segmentLength += data.length;
                    vidBuf.append(data);
                });
                req.on('end', function () {
                    log('Terminating segment for stream with id: ' + stream.id);
                    vidBuf.updateMPD(segmentLength);
                    res.end();
                });
            } else {
                log('No stream found for secret' + req.param('streamSecretId'));
                res.status(404).json({error: 'Incorrect stream id/secret'});
                res.end();
            }
        }
    });
});
/*Deliver mpd for stream*/
router.get('/:streamId/mpd', function (req, res) {
    if (streamingService.isStreaming(req.param(streamId))) {
        res.set({'Content-Type': 'application/xml'});
        res.write(streamingService.getVideoBufferForStream(req.param(streamId)).getMPD());
        res.end();
    }
    else {
        res.status(404);
        res.end();
    }
});
/*Head for segment*/
router.head('/:streamId/:segmentNo', function (req, res) {
    log('Head: Requesting segment number ' + req.param('segmentNo') + ' for stream with id ' + req.param(streamId));
    log('\tHead: Segment from stream with length ' + streamingService.getVideoBufferForStream(req.param(streamId)).getSegmentData(req.param('segmentNo')).length);
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': streamingService.getVideoBufferForStream(req.param(streamId)).getSegmentData(req.param('segmentNo')).length
    });
    res.end();
});
/*Deliver segment*/
router.get('/:streamId/:segmentNo', function (req, res) {
    log('Getting segment ' + req.param('segmentNo') + ' for stream ' + req.param(streamId));
    if (streamingService.isStreaming(req.param(streamId))) {
        var bufferStream = streamingService.getVideoBufferForStream(req.param(streamId));
        log('\t Buffer Stream ' + bufferStream);
        res.set(
            {
                'Connection': 'keep-alive',
                'Content-Type': 'video/webm',
                'Accept-Ranges': 'bytes',
                'Transfer-Encoding': 'chunked',
                'Content-Length': bufferStream.getSegmentData(req.param('segmentNo')).length
            });
        log('Client: Getting stream and piping for stream with id ' + req.param(streamId));
        res.write(bufferStream.getSegmentData(req.param('segmentNo')), 'binary');
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
    }
});
/*Deliver init segment*/
router.get('/:streamId', function (req, res) {
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': '432',
        'Content-Range': '0-431/432'
    });
    res.write(streamingService.getVideoBufferForStream(req.param(streamId)).getInitSegment());
    res.end();
});

module.exports = router;