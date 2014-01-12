'use strict';

module.exports = function () {
	var buildSSEResponse = function (res) {
		return function () {
			var util = require ('util') ,
				msgs = [] ,
				args = arguments;
			
			// SSE has to send something, otherwise throws an error
			if (args.length === 0) throw new Error ('res.sse :: expected a parameter');
			// First case: single argument
			else if (args.length === 1) {
				// Non-empty argument required
				if (_.isEmpty (args[0])) throw new Error ('res.sse :: unexpected empty parameter');
				// Pure text
				else if (_.isString (args[0])) {
					msgs.push ('data:' + args[0]);
				}
				// An object containing the entire configuration of the event
				else if (_.isObject (args[0])) {
					var msgCfg = args[0];
					
					// Check for every single configuration (id, event, retry and data)
					if (!_.isEmpty (msgCfg.id)) msgs.push ('id:' + msgCfg.id);
					if (!_.isEmpty (msgCfg.event)) msgs.push ('event:' + msgCfg.event);
					if (!_.isEmpty (msgCfg.retry) && _.isNumber (msgCfg.retry) && (msgCfg.retry % 1 === 0)) msgs.push ('retry:' + msgCfg.retry);
					if (!_.isEmpty (msgCfg.data)) {
						// Data could be a string or an object (converted into JSON)
						if (_.isString (msgCfg.data)) {
							msgs.push ('data:' + msgCfg.data);
						}
						else if (_.isObject (msgCfg.data)) {
							msgs.push ('data:' + util.format ('%j', msgCfg.data));
						}
					}
				}
				else throw new Error ('res.sse :: expected a String or an Object');
			}
			// Second case: two or more arguments
			else if (args.length >= 2) {
				// First argument has to be a string (it's the event name)
				if (!_.isString (args[0])) throw new Error ('res.sse :: expected a String as the first parameter');
				else msgs.push ('event:' + args[0]);
				
				// Second argument could be a string or an object (converted into JSON)
				if (_.isString (args[1])) msgs.push ('data:' + args[1]);
				else if (_.isObject (args[1])) {
					msgs.push ('data:' + util.format ('%j', args[1]));
				}
				else throw new Error ('res.sse :: expected a String or an Object as the second parameter');
			}

			// Headers
		    res.writeHead (200, {
				'Content-Type': 'text/event-stream',
			    'Cache-Control': 'no-cache',
				'Connection': 'keep-alive' ,
				'Access-Control-Allow-Origin': '*'
			});
			
		    res.write (msgs.join ("\n") + "\n");
        };
	};
	
	return function (req, res, next) {
		res.sse = buildSSEResponse (res);
		
		next ();
	};
};
