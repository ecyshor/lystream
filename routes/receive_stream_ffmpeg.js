/**
 * Created by nreut on 11-Jun-14.
 */
var express = require('express');
var router = express.Router();
var FFmpeg = require('fluent-ffmpeg');
var HashMap = require('hashmap').HashMap;
var Duplex = require('stream').Writable;
var fs = require('fs');

var streamMap = new HashMap;

var count = 0;
var started = false;
var begData;
router.route('/:id')
    .post(function (req, res) {
        //var channelStream = fs.createWriteStream();
        console.log('Receiving data for stream with id ' + req.param('id'));
        console.log(req.headers);

        streamMap.set(req.param('id'), req);
        req.on('data', function (data) {
            console.log('Receiving data: ' + data.toString());
        });
        /*new FFmpeg({source: req}).
         on('error', function (err) {
         console.log('Error:' + err.message);
         }).on('progress', function (progress) {
         console.log('Processing stream 1');
         console.log('Processing at ' + progress.currentKbps);
         console.log('Processing frames ' + progress.frames);
         console.log('Processing at FPS' + progress.currentFps);
         console.log('Processing target size: ' + progress.targetSize);
         console.log('Processing timemark: ' + progress.timemark);
         }).
         on('end', function () {
         console.log('reached the end');
         res.end();
         }).writeToStream(channelStream, { end: true });
         */
        req.on('end', function () {
            console.log('Terminating stream with id: ' + req.param('id'));
        })
    })
    .get(function (req, res) {

        console.log('Getting stream and piping to client with id: ' + req.param('id'));
        if (streamMap.has(req.param('id'))) {
            var noClient = count++;
            res.writeHead(200,
                {
                    'Connection': 'keep-alive',
                    'Content-Type': 'video/webm',
                    'Accept-Ranges': 'bytes',
                    'Transfer-Encoding': 'chunked'
                });
            if (started) {
                // res.write(begData);
            }
            streamMap.get(req.param('id')).on('data', function (data) {
                console.log('Writing data to client ' + noClient + ' with length ' + data.length);
                if (!started) {
                    // begData = data;
                    started = true;
                }
                res.write(data);
            });
            streamMap.get(req.param('id')).on('end', function () {
                res.end();
            });
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });

module.exports = router;