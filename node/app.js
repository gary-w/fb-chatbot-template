const express = require( "express" );
const request = require( "request" );
const bodyParser = require( "body-parser" );
const dotenv = require( "dotenv" );
const path = require( "path" );

const keys = require( "./keys.js" );
const auth = require( "./authorization" );

const app = express();

dotenv.config( { path: path.join( __dirname, "../.env" ) } );
dotenv.load();

app.set( "port", process.env.PORT || 1337 );
// app.set( "view engine", "ejs" );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { verify: auth.verifyRequestSignature } ) );
app.use( express.static( "public" ) );

const VALIDATION_TOKEN = keys.VALIDATION_TOKEN;
const PAGE_ACCESS_TOKEN = keys.PAGE_ACCESS_TOKEN;

// TODO: Error handling if not 200
app.get( "/", ( req, res ) => {
    res.status( 200 ).send( "This is a Fb chatbot." );
} );

app.get( "/fb_webhook", ( req, res ) => {
    if ( req.query[ "hub.mode" ] === "subscribe" &&
      req.query[ "hub.verify_token" ] === VALIDATION_TOKEN ) {
        console.log( "Validating webhook" );
        res.status( 200 ).send( req.query[ "hub.challenge" ] );
    } else {
        console.error( "Failed validation. Make sure the validation tokens match." );
        res.sendStatus( 403 );
    }
} );

app.post( "/fb_webhook", ( req, res ) => {
    const data = req.body;

    if ( data.object === "page" ) {
        data.entry.forEach( ( pageEntry ) => {
            // TODO: Check if the message is intended for the page
            pageEntry.messaging.forEach( ( messagingEvent ) => {
                if ( messagingEvent.message ) {
                    receivedMessage( messagingEvent );
                } else if ( messagingEvent.postback ) {
                    receivedPostback( messagingEvent );
                } else {
                    console.log( "Webhook received unknown messagingEvent: ", messagingEvent );
                }
            } );
        } );

        res.sendStatus( 200 ); // send back a 200 within 20 seconds.
    }
} );

// MESSAGE EVENT
function receivedMessage( event ) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;

    console.log( "Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage );

    const messageText = message.text;
    const messageAttachments = message.attachments;

    if ( messageText ) {
        switch ( messageText ) {
    //   case 'button':
    //     sendButtonMessage(senderID);
    //     break;

    //   case 'quick reply':
    //     sendQuickReply(senderID);
    //     break;

    //   case 'typing on':
    //     sendTypingOn(senderID);
    //     break;

    //   case 'typing off':
    //     sendTypingOff(senderID);
    //     break;

        default:
            sendTextMessage( senderID, messageText );
        }
    } else if ( messageAttachments ) {
        sendTextMessage( senderID, "Message with attachment received" );
    }
}

function receivedPostback( event ) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;
    const payload = event.postback.payload;

    console.log( "Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback );

    sendTextMessage( senderID, "Postback called" );
}

function sendTextMessage( recipientId, messageText ) {
    const messageData = {
        recipient: {
            id: recipientId,
        },
        message: {
            text: messageText,
            metadata: "DEVELOPER_DEFINED_METADATA",
        },
    };

    callSendAPI( messageData );
}

function callSendAPI( messageData ) {
    request( {
        uri: "https://graph.facebook.com/v2.9/me/messages",
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: messageData,

    }, ( error, response, body ) => {
        if ( !error && response.statusCode === 200 ) {
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
            response.statusCode, response.statusMessage, body.error );
        }
    } );
}

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );

module.exports = app;
