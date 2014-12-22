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
    function VideoBuffer(streamId) {
        this.startingSegment = 0;
        this.bufferList = new BufferList();
        this.streamId = streamId;
        this.segmentList = {};
        this.lastSegment = -1;
        this.segmentOffsetByte = 0;
        this.mpd = builder.create('MPD', {version: '1.0', encoding: 'UTF-8', standalone: true}, {pubid: null, sysid: null},
            {allowSurrogateChars: false, skipNullAttributes: false,
                headless: false, ignoreDecorators: false, stringify: {}});
        var date = new Date();
        date.setSeconds(date.getSeconds() + 6);
        this.mpd.att({
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xmlns': 'urn:mpeg:dash:schema:mpd:2011',
            'xsi:schemaLocation': 'urn:mpeg:dash:schema:mpd:2011 http://standards.iso.org/ittf/PubliclyAvailableStandards/MPEG-DASH_schema_files/DASH-MPD.xsd',
            'type': 'dynamic',
            'availabilityStartTime': date.toJSON(),
            'minBufferTime': 'PT0S',
            'profiles': 'urn:mpeg:dash:profile:isoff-live:2011',
            'publishTime':date.toJSON(),
            'suggestedPresentationDelay': 'PT2S',
            'timeShiftBufferDepth': 'PT2S',
            'maxSegmentDuration': 'PT2.00S',
            'minimumUpdatePeriod': 'PT10H'
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
                'maxWidth': '1280',
                'maxHeight': '720',
                'maxFrameRate': '25'
            });
        this.adaptationSet.ele('ContentComponent ', {
            'id': '1',
            'contentType': 'video'
        });
        this.segmentTemplate = this.adaptationSet.ele('SegmentTemplate', {
            'presentationTimeOffset': '0',
            'timescale': '1000',
            'media': '$Number$/',
            'duration': '2000'
        });
        this.adaptationSet.ele('Representation', {
            'id': '1',
            'width': '1024',
            'height': '768',
            'frameRate': '25',
            'bandwidth': '360000',
            'codecs': 'vp8',
            'scanType': 'progressive'
        });
    }

    VideoBuffer.prototype.append = function (buffer) {
        if(this.init === undefined){
            this.init = buffer;
        }
        this.bufferList.append(buffer);
    };
    VideoBuffer.prototype.getSegmentData = function (segmentNumber) {
        segmentNumber = parseInt(segmentNumber);
        if (segmentNumber < this.startingSegment) {
            console.log('\tRequested segment that is no longer in the buffer');
            return '';
        } else {
            if (segmentNumber > this.startingSegment + Object.keys(this.segmentList).length - 1) {
                console.log('\tThe segment has not been received yet');
                return '';
            } else {
                console.log('\tRight segment index received ' + this.segmentList[segmentNumber]);
                var segment = this.segmentList[segmentNumber];
                console.log('\tGetting data for segment corresponding with index: ' + (parseInt(segment.startingIndex) - parseInt(this.segmentOffsetByte)) + '-' + (parseInt(segment.endingIndex) - parseInt(this.segmentOffsetByte)));
                return this.bufferList.slice(parseInt(segment.startingIndex) - parseInt(this.segmentOffsetByte), parseInt(segment.endingIndex - this.segmentOffsetByte) + 1);
            }
        }
    };


    VideoBuffer.prototype.updateMPD = function (segmentLength) {
        if (this.lastSegment in this.segmentList) {
            var lastSegment = this.segmentList[this.lastSegment];
            this.segmentList[this.lastSegment + 1] = {
                dataLength: segmentLength,
                startingIndex: lastSegment.endingIndex + 1,
                endingIndex: lastSegment.endingIndex + segmentLength
            };
            console.log('Creating segment with length: ' + segmentLength + '\n and data :' + JSON.stringify(this.segmentList[this.lastSegment + 1]));
            if (Object.keys(this.segmentList).length > 30) {
                var firstSegmentId = this.lastSegment - 29;
                var firstSegment = this.segmentList[firstSegmentId];
                this.segmentOffsetByte += firstSegment.dataLength;
                console.log('Consuming ' + firstSegment.dataLength);
                this.bufferList.consume(firstSegment.dataLength);
                delete this.segmentList[firstSegmentId];
                this.startingSegment++;
                console.log('Removing segment with id :' + firstSegmentId);
            }
        }
        else {
            this.segmentList[0] = {
                dataLength: segmentLength,
                startingIndex: 0,
                endingIndex: segmentLength - 1
            };

        }
        this.lastSegment++;
    };

    VideoBuffer.prototype.getMPD = function () {
        this.segmentTemplate.att('startNumber', 0);
        //this.mpd.att('availabilityStartTime', date.toJSON());
        this.segmentTemplate.att('initialization','init/');
        return this.mpd.toString();
    };

    VideoBuffer.prototype.getInitSegment = function(){
        return this.init;
    };

    return VideoBuffer;
})();

module.exports = VideoBuffer;
