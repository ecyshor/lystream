/**
 * Created by nreut on 15-Jun-14.
 */
var BufferList = require('bl');

log = require('debug')('lystream:streaming:VideoBuffer ');


var VideoBuffer = (function () {
    function VideoBuffer() {
        this.startingSegment = 0;
        this.bufferList = new BufferList();
        this.segmentList = {};
        this.lastSegment = -1;
        this.segmentOffsetByte = 0;
    }

    VideoBuffer.prototype.append = function (buffer) {
        if(this.init === undefined){
            log('Setting init segment with length ' + buffer.length);
            this.init = buffer;
        }
        this.bufferList.append(buffer);
    };
    VideoBuffer.prototype.getSegmentData = function (segmentNumber) {
        segmentNumber = parseInt(segmentNumber);
        if (segmentNumber < this.startingSegment) {
            log('\tRequested segment that is no longer in the buffer');
            return '';
        } else {
            if (segmentNumber > this.startingSegment + Object.keys(this.segmentList).length - 1) {
                log('The segment has not been received yet');
                return '';
            } else {
                log('Right segment index received ' + this.segmentList[segmentNumber]);
                var segment = this.segmentList[segmentNumber];
                log('Getting data for segment corresponding with index: ' + (parseInt(segment.startingIndex) - parseInt(this.segmentOffsetByte)) + '-' + (parseInt(segment.endingIndex) - parseInt(this.segmentOffsetByte)));
                return this.bufferList.slice(parseInt(segment.startingIndex) - parseInt(this.segmentOffsetByte), parseInt(segment.endingIndex - this.segmentOffsetByte) + 1);
            }
        }
    };

    /**
     * Method that must be called after all the data for a segment has been received. The indexing of the segments for
     * the buffer are updated
     * */
    VideoBuffer.prototype.updateBuffer = function (segmentLength) {
        if (this.lastSegment in this.segmentList) {
            var lastSegment = this.segmentList[this.lastSegment];
            this.segmentList[this.lastSegment + 1] = {
                dataLength: segmentLength,
                startingIndex: lastSegment.endingIndex + 1,
                endingIndex: lastSegment.endingIndex + segmentLength
            };
            log('Creating segment with length: ' + segmentLength + '\n and data :' + JSON.stringify(this.segmentList[this.lastSegment + 1]));
            if (Object.keys(this.segmentList).length > 6) {
                var firstSegmentId = this.lastSegment - 5;
                var firstSegment = this.segmentList[firstSegmentId];
                this.segmentOffsetByte += firstSegment.dataLength;
                log('Consuming ' + firstSegment.dataLength);
                this.bufferList.consume(firstSegment.dataLength);
                delete this.segmentList[firstSegmentId];
                this.startingSegment++;
                log('Removing segment with id :' + firstSegmentId);
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

    VideoBuffer.prototype.getInitSegment = function(){
        return this.init;
    };

    return VideoBuffer;
})();

module.exports = VideoBuffer;
