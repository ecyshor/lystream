/**
 * Created by Nicu on 02/11/2014.
 */

var HashMap = require('hashmap').HashMap;

var StreamingService = (function () {
    function StreamingService(message) {
        this.greeting = message;
    }

    StreamingService.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return StreamingService;
})();

module.exports = StreamingService;
