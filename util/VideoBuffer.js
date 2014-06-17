/**
 * Created by nreut on 15-Jun-14.
 */
/**
 * A buffer that contains the last bytes received. The number of bytes stored by
 * default is 1000000 and can be configured for different types of stream so that
 * we can hold the approximate same video length no matter what the quality is.
 * */
var BufferList = require('bl');
var builder = require('xmlbuilder');

var VideoBuffer = (function () {
    function VideoBuffer(totalSize, streamId) {
        this.size = totalSize;
        this.startingIndex = 0;
        this.bufferList = new BufferList();
        this.streamId = streamId;
        this.mpd = builder.create('MPD', {version: '1.0', encoding: 'UTF-8', standalone: true});
        this.mpd.att({
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
            'xsi:schemaLocation': 'urn:mpeg:dash:schema:mpd:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
            'type': 'dynamic',
            'availabilityStartTime': new Date().toJSON(),
            'minBufferTime': 'PT5S',
            'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
            'suggestedPresentationDelay': 'PT5S',
            'timeShiftBufferDepth': 'PT40S',
            'maxSegmentDuration': 'PT2.080S'
        });
        this.mpd.ele('Location', {}, 'stream/' + streamId + '/mpd');

        this.adaptationSet = this.mpd.ele('Period', {
            'id': '1',
            'bitstreamSwitching': true
        })
            .ele('AdaptationSet', {
                'mimeType': 'video/webm',
                'segmentAlignment': 'true',
                'startWithSAP': 1
            });
        this.adaptationSet.ele('Representation', {
            'id': '1',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });
        this.adaptationSet.ele('SegmentTemplate', {
            'presentationTimeOffset': '0',
            'timescale': 90000,
            'media': 'stream/22/$Number$',
            'duration': 180000
        });
        console.log('Createad mpd ' + this.mpd);
    }

    VideoBuffer.prototype.append = function (buffer) {
        console.log('Appending data to video buffer with length ' + buffer.length);
        this.bufferList.append(buffer);
        console.log('Buffer for video now with length of : ' + this.bufferList.length);
        if (this.bufferList.length > this.size) {
            this.startingIndex += this.bufferList.length - this.size;
            this.bufferList.consume(this.bufferList.length - this.size);
        }
    };
    VideoBuffer.prototype.slice = function (start, end) {
        if (this.startingIndex > start) {
            start = this.startingIndex;
        }
        return this.bufferList.slice(start - this.startingIndex, end - this.startingIndex);
    };

    VideoBuffer.prototype.slice = function (start) {
        if (this.startingIndex > start) {
            start = this.startingIndex;
        }
        return this.bufferList.slice(start - this.startingIndex);
    };

    VideoBuffer.prototype.updateMPD = function (segmentLength) {
        this.segmentList.ele('SegmentURl', {
            'media': 'stream/' + this.streamId,
            'mediaRange': this.bufferList.length - segmentLength + '-' + this.bufferList.length
        });
        console.log('Updated MPD : ' + this.mpd)
    };

    return VideoBuffer;
})();

module.exports = VideoBuffer;
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