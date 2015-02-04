/**
 * Created by nreut on 15-Jun-14.
 */
var builder = require('xmlbuilder'),
    VideoBuffer = require('../util/VideoBuffer'),
    ffmpeg = require('fluent-ffmpeg'),
    stream = require('stream'),
    MemoryStream = require('memorystream');
log = require('debug')('lystream:streaming:IncomingStreamHandler ');


var IncomingStreamHandler = (function () {
    function IncomingStreamHandler() {
        this.bufferRepresentations = {
            original: {
                buffer: new VideoBuffer(),
                lastSegmentLength: 0,
                updateBuffer: function (segmentLength) {
                    log('Updating buffer for original representation for new segment with length ' + this.lastSegmentLength);
                    if (!segmentLength) {
                        this.buffer.updateBuffer(this.lastSegmentLength);
                    } else {
                        log('Updating downgraded with outer segment length(WARN)');
                        this.buffer.updateBuffer(segmentLength);
                    }
                    this.lastSegmentLength = 0;
                }
            },
            downgraded: {
                buffer: new VideoBuffer(),
                lastSegmentLength: 0,
                updateBuffer: function (segmentLength) {
                    log('Updating buffer for downgraded representation for new segment  with length ' + segmentLength);
                    if (!segmentLength) {
                        log('Updating downgraded with object inner segment length(WARN)');
                        this.buffer.updateBuffer(this.lastSegmentLength);
                    } else {
                        this.buffer.updateBuffer(segmentLength);
                    }
                    this.lastSegmentLength = 0;
                }
            }
        };
        this.mpd = builder.create('MPD', {version: '1.0', encoding: 'UTF-8', standalone: true}, {
                pubid: null,
                sysid: null
            },
            {
                allowSurrogateChars: false, skipNullAttributes: false,
                headless: false, ignoreDecorators: false, stringify: {}
            });
        var date = new Date();
        date.setSeconds(date.getSeconds() + 9);
        this.mpd.att({
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
            'xsi:schemaLocation': 'urn:mpeg:dash:schema:mpd:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
            'type': 'dynamic',
            'availabilityStartTime': date.toJSON(),
            'minBufferTime': 'PT0S',
            'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
            'publishTime': date.toJSON(),
            'suggestedPresentationDelay': 'PT0S',
            'timeShiftBufferDepth': 'PT2S',
            'maxSegmentDuration': 'PT2sS'
        });
        this.adaptationSet = this.mpd.ele('Period', {
            'id': '1',
            'bitstreamSwitching': 'true',
            'start': 'PT0S'
        })
            .ele('AdaptationSet', {
                'mimeType': 'video/webm',
                'segmentAlignment': 'true',
                'startWithSAP': '1',
                'maxWidth': '1920',
                'maxHeight': '1080',
                'maxFrameRate': '25'
            });
        this.adaptationSet.ele('ContentComponent ', {
            'id': '1',
            'contentType': 'video'
        });
        this.segmentTemplate = this.adaptationSet.ele('SegmentTemplate', {
            'presentationTimeOffset': '0',
            'timescale': '1000',
            'media': '$RepresentationID$/$Number$/',
            'duration': '2000'
        });
        this.adaptationSet.ele('Representation', {
            'id': 'downgraded',
            'width': '1360',
            'height': '768',
            'frameRate': '10',
            'bandwidth': '1500000',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });
 /*       this.adaptationSet.ele('Representation', {
            'id': 'downgraded',
            'width': '800',
            'height': '600',
            'frameRate': '10',
            'bandwidth': '500000',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });*/
    }


    IncomingStreamHandler.prototype.getSegment = function (representation, segmentNumber) {
        log('Received request for segment ' + segmentNumber + ' for representation ' + representation);
        return this.bufferRepresentations[representation].buffer.getSegmentData(segmentNumber);
    };


    IncomingStreamHandler.prototype.updateStreamInformation = function () {
        //var self = this;
        // Object.keys(this.bufferRepresentations).map(function (representation) {
        this.bufferRepresentations.original.updateBuffer();
        // });
        this.lastSegmentTimestamp = new Date().getTime();
        log('Set last segment timestamp ' + this.lastSegmentTimestamp);
    };

    IncomingStreamHandler.prototype.getMPD = function () {
        this.segmentTemplate.att('startNumber', 0);
        //this.mpd.att('availabilityStartTime', date.toJSON());
        this.segmentTemplate.att('initialization', '$RepresentationID$/init');
        return this.mpd.toString();
    };

    IncomingStreamHandler.prototype.getInitSegment = function (representation) {
        return this.bufferRepresentations[representation].buffer.getInitSegment();
    };
    /**
     * Checks if a segment has been received to this stream in the last 10 seconds by comparing current timestamp
     * to the timestamp of the last received segment
     *
     **/
    IncomingStreamHandler.prototype.isAlive = function () {
        var difference = new Date().getTime() - this.lastSegmentTimestamp;
        return difference < 10000;
    };
    IncomingStreamHandler.prototype.handleStreamData = function (req) {
        var self = this;
        var pipingStream = new MemoryStream();

        var outputOriginal = new stream.Writable();
        outputOriginal._write = (function (chunk, encoding, done) {
            console.log('Received original data with length ' + chunk.length);
            pipingStream.write(chunk);
            self.bufferRepresentations.original.buffer.append(chunk);
            self.bufferRepresentations.original.lastSegmentLength += chunk.length;
            done();
        });
        var downgradedSegmentLength = 0;

        req.pipe(outputOriginal);
        outputOriginal.on('finish', function () {
            log('Finished output original stream for segment, updating segment information.');
            self.updateStreamInformation();
            pipingStream.end();
        });
        log('Running ffmpeg command');
        ffmpeg(pipingStream,{priority:20})
            //.inputFormat('webm')
            //.native()
            //.size('800x600')//'-force_key_frames expr:eq(n,0)'
            //.videoCodec('libvpx')
            .outputOptions(['-vf scale=640x360','-force_key_frames 00:00:00.000','-g 1'])
            //.outputOptions(['-flags +global_header','-g 1','-deadline realtime','-profile:v 0'
            //,'-cpu-used 0','-qmin 10','-qmax 42','-threads 3', '-slices 4','-dash 1'])
            //.videoBitrate(500)
            .format('webm')
            .on('start', function (cmd) {
               log('Spawned Ffmpeg with command ' + cmd);
            })
            .on('end', function () {
                log('FFMPEG finished processing, updating downgraded stream information');
                self.bufferRepresentations.downgraded.updateBuffer(downgradedSegmentLength);
            })
            .on('error', function(err, stdout, stderr) {
                console.log(err.message); //this will likely return "code=1" not really useful
                console.log("stdout:\n" + stdout);
                console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
            })
            .pipe().on('data',function(data){
                console.log('FFMPEG outputed a fragment of ' + data.length);
                self.bufferRepresentations.downgraded.buffer.append(data);
                self.bufferRepresentations.downgraded.lastSegmentLength += data.length;
                downgradedSegmentLength += data.length;
            });
    };

    return IncomingStreamHandler;
})();

module.exports = IncomingStreamHandler;
