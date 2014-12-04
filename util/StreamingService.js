/**
 * Created by ecyshor on 27.11.2014.
 */
var HashMap = require('hashmap').HashMap,
    VideoBuffer = require('../util/VideoBuffer'),
    log = require('debug')('lystream:StreamingService');
var streamMap = new HashMap();
console.log('Init streamingService');
function StreamingService () {
    if (!(this instanceof StreamingService)) {
        return new StreamingService();
    }
}
StreamingService.prototype.getVideoBufferForStream = function(streamId){
        var vidBuf;
        if (!streamMap.has(streamId)) {
            log('The stream is new, creating video buffer.');
            vidBuf = new VideoBuffer(streamId);
            streamMap.set(streamId, vidBuf);
        } else {
            log('Video buffer already exists');
            vidBuf = streamMap.get(streamId);
        }
        return vidBuf;
    };

StreamingService.prototype.isStreaming = function(streamId){
    return streamMap.has(streamId);
};
exports.StreamingService = new StreamingService();