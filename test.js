#!/usr/bin/env node

var lambda = require('./karmabot.js');

var event = {
	  "resource": "/KarmaBot",
	  "path": "/KarmaBot",
	  "httpMethod": "POST",
	  "headers": {
		"Accept": "application/json",
		"Authorization": "HMAC CL1NQvWf14Nl7kdBXk57hwvDUjUZAz2RpuTeHQKcyss=",
		"CloudFront-Forwarded-Proto": "https",
		"CloudFront-Is-Desktop-Viewer": "true",
		"CloudFront-Is-Mobile-Viewer": "false",
		"CloudFront-Is-SmartTV-Viewer": "false",
		"CloudFront-Is-Tablet-Viewer": "false",
		"CloudFront-Viewer-Country": "US",
		"Content-Type": "application/json; charset=utf-8",
		"Host": "2hl3r2g11i.execute-api.us-east-1.amazonaws.com",
		"Via": "1.1 268e93bbea8973f6b97c5a37790d181f.cloudfront.net (CloudFront)",
		"X-Amz-Cf-Id": "OlI_51qiMgXReFAkA1xlvn2NzVAkvmsvdxqHkF3FOWiPulgETwZHCg==",
		"X-Amzn-Trace-Id": "Root=1-58d1c179-57bc6cd63a71dc964be74c47",
		"X-Forwarded-For": "13.92.236.34, 54.240.144.66",
		"X-Forwarded-Port": "443",
		"X-Forwarded-Proto": "https",
		"x-ms-request-id": "b3febe40-122b-4db3-b9e3-b5e830812873",
		"x-ms-session-id": "621915241785335442"
	  },
	  "queryStringParameters": {
		"id": "karmabot"
	  },
	  "pathParameters": null,
	  "stageVariables": null,
	  "requestContext": {
		"accountId": "904181115747",
		"resourceId": "3ulp6x",
		"stage": "prod",
		"requestId": "439d7261-0e94-11e7-a408-2fb6d52efff0",
		"identity": {
		  "cognitoIdentityPoolId": null,
		  "accountId": null,
		  "cognitoIdentityId": null,
		  "caller": null,
		  "apiKey": null,
		  "sourceIp": "13.92.236.34",
		  "accessKey": null,
		  "cognitoAuthenticationType": null,
		  "cognitoAuthenticationProvider": null,
		  "userArn": null,
		  "userAgent": null,
		  "user": null
		},
		"resourcePath": "/KarmaBot",
		"httpMethod": "POST",
		"apiId": "2hl3r2g11i"
	  },
	  "body": "{\"type\":\"message\",\"id\":\"1490141559657\",\"timestamp\":\"2017-03-22T00:12:39.609Z\",\"localTimestamp\":null,\"serviceUrl\":\"https://smba.trafficmanager.net/amer-client-ss.msg/\",\"channelId\":\"msteams\",\"from\":{\"id\":\"29:1gbGYul64hbkf62oTkMas3HqOEZ_vnCzQk0_fAQpsbTiwgpJ-nKoTg_7qwp6IUFvgEkcU1V5YejnQPIeGawIdxA\",\"name\":\"Walters, Jeff\"},\"conversation\":{\"isGroup\":true,\"id\":\"19:35f6545d5692424b887a61eee8f26caa@thread.skype;messageid=1490141559657\",\"name\":null},\"recipient\":null,\"textFormat\":\"plain\",\"attachmentLayout\":null,\"membersAdded\":null,\"membersRemoved\":null,\"topicName\":null,\"historyDisclosed\":null,\"locale\":null,\"text\":\"KarmaBot   <at>Bradshaw, Scott W.</at> ++\",\"summary\":null,\"attachments\":[{\"contentType\":\"text/html\",\"contentUrl\":null,\"content\":\"<div><span contenteditable=\\\"false\\\" itemscope=\\\"\\\" itemtype=\\\"http://schema.skype.com/Mention\\\" itemid=\\\"0\\\">KarmaBot</span><span contenteditable=\\\"false\\\" itemscope=\\\"\\\" itemtype=\\\"http://schema.skype.com/Mention\\\" itemid=\\\"1\\\"></span>&#160;<span contenteditable=\\\"false\\\" itemscope=\\\"\\\" itemtype=\\\"http://schema.skype.com/Mention\\\" itemid=\\\"2\\\">Bradshaw, Scott W.</span>++</div>\",\"name\":null,\"thumbnailUrl\":null}],\"entities\":[{\"type\":\"mention\",\"mentioned\":{\"id\":\"28:22e50a9b-80cc-4eab-a092-ce64796d28d7\",\"name\":\"\"}},{\"type\":\"mention\",\"mentioned\":{\"id\":\"29:1cYHNCRJKfGLToAjzG6sQZsl3xnPrAdqCemAVeDZwJ7WONBGIep6RYkxL-KI2iN1otTOYu8A0HS-k2XaLf6YCUA\",\"name\":\"Bradshaw, Scott W.\"},\"text\":\"<at>Bradshaw, Scott W.</at>\"},{\"type\":\"clientInfo\",\"locale\":\"en-US\",\"country\":\"US\",\"platform\":\"Windows\"}],\"channelData\":{\"teamsChannelId\":\"19:35f6545d5692424b887a61eee8f26caa@thread.skype\",\"teamsTeamId\":\"19:f93d6d0257504a588aba13211c601a83@thread.skype\",\"channel\":{\"id\":\"19:35f6545d5692424b887a61eee8f26caa@thread.skype\"},\"team\":{\"id\":\"19:f93d6d0257504a588aba13211c601a83@thread.skype\"},\"onBehalfOf\":\"[{\\\"itemid\\\":0,\\\"mri\\\":\\\"c11c6111-e149-4830-8ed0-8b04bae819e7\\\",\\\"mentionType\\\":\\\"webhook\\\",\\\"displayName\\\":\\\"KarmaBot\\\"}]\",\"tenant\":{\"id\":\"101ce67d-13f2-447a-bb65-0989b89dfdb4\"}},\"action\":null,\"replyToId\":null,\"value\":null}",
	  "isBase64Encoded": false
	};


lambda.handler(event, {}, _ => {});
