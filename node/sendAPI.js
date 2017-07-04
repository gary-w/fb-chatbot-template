const request = require( "request" );
const keys = require( "./keys" );

const PAGE_ACCESS_TOKEN = keys.PAGE_ACCESS_TOKEN;

const callSendAPI = ( messageData ) => {
    request( {
        uri: "https://graph.facebook.com/v2.9/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: messageData,

    }, ( err, res, body ) => {
        if ( !err && res.statusCode === 200 ) {
            const recipientId = body.recipient_id;
            const messageId = body.message_id;

            if ( messageId ) {
                console.log( "Successfully sent message with id %s to recipient %s",
              messageId, recipientId );
            } else {
                console.log( "Successfully called Send API for recipient %s",
              recipientId );
            }
        } else {
            console.error( "Failed calling Send API",
            res.statusCode, res.statusMessage, body.error );
        }
    } );
};

module.exports = {
    callSendAPI,
};
