'use strict';

console.log('Loading function');

const doc = require('dynamodb-doc');
const crypto = require('crypto');
const Q = require('q');
const dynamo = new doc.DynamoDB();


exports.handler = (event, context, callback) => {
	//console.log('Received event:', JSON.stringify(event, null, 2));
	if (process.env.ignoreSecurity || validate(event)) {
		
		var body = JSON.parse(event.body),
			actionsRe = /<at>([^<]+)<\/at> {0,2}([+-]{2})|\blist\b/g,
			actions = [], action,
			resultPromisesArray = [];
		

		while((action = actionsRe.exec(body.text)) !== null) {
			if (action[0] === "list") {
				actions.push({ type: 'list', teamid: body.channelData.teamsTeamId });
			} else if (action[2] != null) {
				let name = action[1];
				let op = action[2]
				let mention = body.entities.find(entity => { return entity.mentioned && entity.mentioned.name === name })
				
				if (mention) {
					actions.push({ type: op === "++" ? 'increment' : 'decrement', userid: mention.mentioned.id, name: mention.mentioned.name, teamid: body.channelData.teamsTeamId });
				}
			}
		}

		//console.log("Submitted actions:", actions);

		if (actions.length == 0) {
			sendHelp(context, callback);
			return;
		}

		actions.forEach(action => { 
			switch (action.type) {
				case "list":
					resultPromisesArray.push(getScoreList(action));
					break;
				case "increment":
					resultPromisesArray.push(increment(action));
					break;
				case "decrement": 
					resultPromisesArray.push(increment(action));
			}
		}, this);

		Q.all(resultPromisesArray).fail(error => { console.error(error) }).done(results => {
			//console.log("final result: ", results);
			let response = results.join('<br>');

			callback(null, {
				statusCode: 200,
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ type: 'message', text: response })
			});
		});
		
	} else {
		callback(null, {
			statusCode: '401'
		});
	}

};

function getScoreList(action) {
	let params = {
		TableName: 'KarmaBot',
        KeyConditionExpression: "#t = :tid",
        ExpressionAttributeNames:{
            "#t": "teamid"
        },
        ExpressionAttributeValues: {
            ":tid":action.teamid
        }
	}

    //console.log("scan params:",params)

	return Q.ninvoke(dynamo, "query", params)
		.then(data => {
			//console.log("scan data:",data)
            let res = '';

            if (data.Items.length) {
                res += "<ol>";

                // sorting by score
                data.Items.sort((a, b) => b.score - a.score);
              
                res += data.Items.reduce((acc, user) => {
                    return  acc += "<li>" + user.name + ": " + user.score + "</li>";
                }, '');

                res += "</ol>";

            } else { res = "No one has karma :(" }
			//console.log("score list result:", res);
			return res;
		}).fail(error => {
			console.error('Error getting score list:', error);
		});
}

function increment(action) {
	let params = {
		TableName: 'KarmaBot',
        Key: { "userid": action.userid, "teamid": action.teamid }
	};

	return Q.ninvoke(dynamo, "getItem", params)
		.then(data => {
			//console.log("Getting user for inc:", data);
			if (data.Item) {
				let params = {
					TableName: 'KarmaBot',
					Key: { "userid": data.Item.userid, "teamid": data.Item.teamid },
					ExpressionAttributeNames: { "#S": "score", "#LS": "lastscore" },
					ExpressionAttributeValues: { ":s": action.type === "increment" ? data.Item.score + 1 : data.Item.score - 1 , ":ls": Date.now() },
					ReturnValues: "ALL_NEW",
					UpdateExpression: "SET #S = :s, #LS = :ls"
				}
				
				//console.log("update params:", params);

				return Q.ninvoke(dynamo, "updateItem", params)
					.then(data => {
						//console.log("after update", data);
						return "<at>" + data.Attributes.name + "</at> has " + data.Attributes.score + " karma."
					});
			} else {
				let score = action.type === "increment" ? 1 : -1;
                let friendlyName = action.name.split(', ').reverse().join(' ');
				let params = {
					TableName: 'KarmaBot',
					Item: {
						"userid": action.userid,
						"name": friendlyName,
						"score": score,
						"lastscore": Date.now(),
                        "teamid": action.teamid
					}
				};
				return Q.ninvoke(dynamo, "putItem", params)
					.then(data => {
						//console.log("after put", data);
						return "<at>" + data.Attributes.name + "</at> has " + data.Attributes.score + " karma."
					});
			}
		}).fail(error => {
			console.error('Error updating:', error);
		});
}


function sendHelp(context, callback) {
	let response = ["You can use the following commands: ",
					"<li>@user++ : to add a point to a user</li>",
					"<li>@user-- : to remove a point from a user</li>",
					"<li>list    : to list the current score board</li>"
				   ].join('');

	callback(null, {
		statusCode: 200,
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ type: 'message', text: response })
	});
}

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

function validate(request) {
	let messageContent = request.body,
		authHeader = request.headers && request.headers.Authorization,
		claimedSenderId = request.queryStringParameters.id,
		signature, hash;
		
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

