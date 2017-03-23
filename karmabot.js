'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');

const crypto = require('crypto');

const dynamo = new doc.DynamoDB();


/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 *
 * To scan a DynamoDB table, make a GET request with the TableName as a
 * query string parameter. To put, update, or delete an item, make a POST,
 * PUT, or DELETE request respectively, passing in the payload to the
 * DynamoDB API as a JSON body.
 */
exports.handler = (event, context, callback) => {
    console.log('Received event:', JSON.stringify(event, null, 2));
    if (validate(event)) {
        
        var body = JSON.parse(event.body);
        
        if (body.text == "list") {
            get
        }
        
        
        const done = (err, res) => {
    		
    		if (res && res.Item) {
    		    
    			callback(null, {
    				statusCode: 200,
    				headers: { 'Content-Type': 'application/json' },
    				body: JSON.stringify({ type: 'message', text: "<li>one</li><li>two</li>" })   //JSON.stringify(res) })
    			});
    		} else {
    			var params = {
    				TableName: 'KarmaBotUsers',
    				Item: {
    					"username": 'jwalters',
    					"score": 1,
    					"lastScore": Date.now()
    				}
    			};
    
    			dynamo.putItem(params, (err, res) => {
    				callback(null, {
    					statusCode: err ? 400 : 200,
    					body: err ? err.message : JSON.stringify(res),
    					headers: {
    						'Content-Type': 'application/json',
    					},
    				});
    			});
    		}
    
    	}
    
        var params = {
    		TableName: 'KarmaBotUsers',
    		Key: { "username": 'jwalters' }
        };
    	
    
        dynamo.getItem(params, done);
        
    } else {
        callback(null, {
			statusCode: '401'
		});
    }

};

function validate(request) {
	let messageContent = request.body,
		authHeader = request.headers && request.headers.Authorization,
		claimedSenderId = request.queryStringParameters.id,
		signature, hash;
		
	console.log('Transforned content:', messageContent);

	if (!claimedSenderId) {
		console.log('Id not present on request', request);
		return false;
	}

	if (!authHeader) {
		console.log('Authentication header not provided', request);
		return false;
	}

	if (!authHeader.startsWith("HMAC ")) {
		console.log('Incorrect auth scheme', request);
		return false;
	}

	if (!messageContent) {
		console.log('Unable to validate authentication header for messages with empty body', request);
		return false;
	}

	signature = authHeader.substring(5);

	const secret = new Buffer(process.env[claimedSenderId], 'base64');
	const contentBytes = new Buffer(stringToUtf8ByteArray(messageContent));
	const hmac = crypto.createHmac('SHA256', secret);

	hmac.update(contentBytes);
	hash = hmac.digest('base64');

	if (hash == signature) {
	    console.log("Authenticated!");
		return true;
	}
  
	console.log('AuthHeaderValueMismatch', "Expected:'" + hash + "' Provided:'" + signature + "'");
	return false;
}

function decodeHtmlEntity(str) {
    
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
};

function stringToUtf8ByteArray(str) {
     let out = [], p = 0;

    for (var i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) {
            out[p++] = c;
        } else if (c < 2048) {
            out[p++] = (c >> 6) | 192;
            out[p++] = (c & 63) | 128;
        } else if (
            ((c & 0xFC00) == 0xD800) && (i + 1) < str.length &&
            ((str.charCodeAt(i + 1) & 0xFC00) == 0xDC00)) {
            // Surrogate Pair
            c = 0x10000 + ((c & 0x03FF) << 10) + (str.charCodeAt(++i) & 0x03FF);
            out[p++] = (c >> 18) | 240;
            out[p++] = ((c >> 12) & 63) | 128;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        } else {
            out[p++] = (c >> 12) | 224;
            out[p++] = ((c >> 6) & 63) | 128;
            out[p++] = (c & 63) | 128;
        }
    }
    return out;
};
