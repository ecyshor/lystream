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
router.post('/:streamSecretId/:segmentNo', function (req, res) {
    var query = Stream.where({ uploadSecretPassKey: req.params['streamSecretId']});
    query.findOne(function (err, stream) {
            if (err) {
                log('Error retrieving stream for upload');
                res.status(500).json(err);
                res.end();
            }else{
            if (stream !== null) {
                log('Receiving data for stream ' + stream.id);
                var streamHandler = streamingService.getIncomingStreamHandler(stream.id);
                streamHandler.handleStreamData(req);
                req.on('end', function () {
                    log('Terminating segment for stream with number ' + req.params['segmentNo'] + 'with id: ' + stream.id);
                    res.end();
                });
            } else {
                log('No stream found for secret' + req.params['streamSecretId']);
                res.status(404).json({error: 'Incorrect stream id/secret'});
                res.end();
            }
        }
    });
});
/*Deliver mpd for stream*/
router.get('/:streamId/mpd', function (req, res) {
    if (streamingService.isStreaming(req.params[streamId])) {
        res.set({'Content-Type': 'application/xml'});
        res.write(streamingService.getIncomingStreamHandler(req.params[streamId]).getMPD());
        res.end();
    }
    else {
        res.status(404);
        res.end();
    }
});
/*Head for segment*/
router.head('/:streamId/:representationId/:segmentNo', function (req, res) {
    log('Head: Requesting segment number ' + req.params['segmentNo']+ ' for representation ' + req.params['representationId'] + ' for stream with id ' + req.params[streamId]);
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': streamingService.getIncomingStreamHandler(req.params[streamId]).getSegment(req.params['representationId'], req.params['segmentNo']).length
    });
    res.end();
});
/*Deliver init segment*/
router.get('/:streamId/:representationId/init', function (req, res) {
    res.set({
        'Connection': 'keep-alive',
        'Content-Type': 'video/webm',
        'Accept-Ranges': 'bytes',
        'Transfer-Encoding': 'chunked',
        'Content-Length': '432'
    });
    res.write(streamingService.getIncomingStreamHandler(req.params[streamId]).getInitSegment(req.params['representationId']));
    res.end();
});
/*Deliver segment*/
router.get('/:streamId/:representationId/:segmentNo', function (req, res) {
    log('Getting segment ' + req.params['segmentNo'] + ' for stream ' + req.params[streamId]);
    if (streamingService.isStreaming(req.params[streamId])) {
        var bufferStream = streamingService.getIncomingStreamHandler(req.params[streamId]);
        log('\t Buffer Stream ' + bufferStream);
        res.set(
            {
                'Connection': 'keep-alive',
                'Content-Type': 'video/webm',
                'Accept-Ranges': 'bytes',
                'Transfer-Encoding': 'chunked',
                'Content-Length': bufferStream.getSegment(req.params['representationId'], req.params['segmentNo']).length
            });
        log('Client: Getting stream and piping for stream with id ' + req.params[streamId]);
        res.write(bufferStream.getSegment(req.params['representationId'], req.params['segmentNo']), 'binary');
        res.end();
    }
    else {
        res.writeHead(404);
        res.end();
    }
});


module.exports = router;