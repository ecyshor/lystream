/**
 * Created by nreut on 15-Jun-14.
 */
var builder = require('xmlbuilder'),
    VideoBuffer = require('../util/VideoBuffer'),
    ffmpeg = require('fluent-ffmpeg'),
    stream = require('stream');
log = require('debug')('lystream:streaming:IncomingStreamHandler');


var IncomingStreamHandler = (function () {
    function IncomingStreamHandler() {
        this.bufferRepresentations = {
            original: {
                buffer: new VideoBuffer(),
                lastSegmentLength: 0,
                updateBuffer: function () {
                    log('Updating buffer for new segment received in ' +  (new Date().getTime() - this.lastSegmentTimestamp));
                    this.buffer.updateBuffer(this.lastSegmentLength);
                    this.lastSegmentLength = 0;
                }
            },
            downgraded: {
                buffer: new VideoBuffer(),
                lastSegmentLength: 0,
                updateBuffer: function () {
                    this.buffer.updateBuffer(this.lastSegmentLength);
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
        date.setSeconds(date.getSeconds() + 8);
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
            'timeShiftBufferDepth': 'PT4S',
            'maxSegmentDuration': 'PT2.00S'
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
            'id': 'original',
            'width': '1360',
            'height': '768',
            'frameRate': '10',
            'bandwidth': '1500000',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });
        this.adaptationSet.ele('Representation', {
            'id': 'downgraded',
            'width': '800',
            'height': '600',
            'frameRate': '10',
            'bandwidth': '500000',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });
    }

    IncomingStreamHandler.prototype.getSegment = function (representation, segmentNumber) {
        this.bufferRepresentations[representation].getSegment(segmentNumber);
    };


    IncomingStreamHandler.prototype.updateStreamInformation = function () {
        Object.keys(this.bufferRepresentations).map(function (representation) {
            this.bufferRepresentations[representation].updateBuffer();
        });
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
        this.bufferRepresentations[representation].getInitSegment();
    };
    /**
     * Checks if a segment has been received to this stream in the last 10 seconds by comparing current timestamp
     * to the timestamp of the last received segment
     *
     **/
    IncomingStreamHandler.prototype.isAlive = function () {
        var difference = new Date().getTime() - this.lastSegmentTimestamp;
        log('Checking alive status, difference between timestamps: ' + difference);
        return difference < 10000;
    };
    IncomingStreamHandler.prototype.handleStreamData = function (req) {
        log('Received data to handle, transcoding to lower quality and updating representations buffer');
        req.on('data', function (data) {
            log('Updating original quality representation');
            this.bufferRepresentations['original'].buffer.append(data);
            this.bufferRepresentations['original'].lastSegmentLength += data;
        });
        var ffmpegResult = new stream.Writable();
        ffmpegResult._write = function (chunk, encoding, done) {
            log('Updating downgraded quality representation');
            this.bufferRepresentations['downgraded'].buffer.append(chunk);
            this.bufferRepresentations['downgraded'].lastSegmentLength += chunk.length;
        };
        ffmpeg(req)
            .size('800x600')
            .videoBitrate(500)
            .keepDAR()
            .on('end',function(){
                log('FFMPEG finished processing, updating stream information');
                this.updateStreamInformation();
            })
            .stream(ffmpegResult);


    };

    return IncomingStreamHandler;
})();

module.exports = IncomingStreamHandler;
