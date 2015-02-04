/**
 * Created by ecyshor on 27.11.2014.
 */
var HashMap = require('hashmap').HashMap,
    IncomingStreamHandler = require('../util/IncomingStreamHandler'),
    log = require('debug')('lystream:StreamingService ');

var streamMap = new HashMap();
function StreamingService() {
    if (!(this instanceof StreamingService)) {
        return new StreamingService();
    }
}
StreamingService.prototype.getIncomingStreamHandler = function (streamId) {
    var incomingStreamHandler;
    if (!streamMap.has(streamId)) {
        log('The stream is new, creating stream handler.');
        incomingStreamHandler = new IncomingStreamHandler();
        streamMap.set(streamId, incomingStreamHandler);
        setTimeout(checkAlive, 3000, incomingStreamHandler, streamId);
    } else {
        log('Stream handler already exists');
        incomingStreamHandler = streamMap.get(streamId);
    }
    return incomingStreamHandler;
};

StreamingService.prototype.isStreaming = function (streamId) {
    return streamMap.has(streamId);
};

function checkAlive(streamHandler, streamId) {
    if (!streamHandler.isAlive()) {
        log('Buffer for stream ' + streamId + ' is inactive, deleting stream.')
        streamMap.remove(streamId);
    } else {
        setTimeout(checkAlive, 3000, streamHandler, streamId);
    }
}
exports.StreamingService = new StreamingService();