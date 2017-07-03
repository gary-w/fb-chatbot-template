const express = require( "express" );
const request = require( "request" );
const bodyParser = require( "body-parser" );
const config = require( "config" );
const dotenv = require( "dotenv" );
const path = require( "path" );

const app = express();

dotenv.config( { path: path.join( __dirname, "../.env" ) } );
dotenv.load();

app.set( "port", process.env.PORT || 1337 );
// app.set( "view engine", "ejs" );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( express.static( "public" ) );

const APP_SECRET = ( process.env.APP_SECRET ) ?
  process.env.APP_SECRET :
  config.get( "appSecret" );

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = ( process.env.VALIDATION_TOKEN ) ?
  ( process.env.VALIDATION_TOKEN ) :
  config.get( "validationToken" );

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = ( process.env.PAGE_ACCESS_TOKEN ) ?
  ( process.env.PAGE_ACCESS_TOKEN ) :
  config.get( "pageAccessToken" );

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = ( process.env.SERVER_URL ) ?
  ( process.env.SERVER_URL ) :
  config.get( "serverURL" );

if ( !( APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL ) ) {
    console.error( "Missing config values" );
    process.exit( 1 );
}

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
    console.log('whats req body here?', data);

    if ( data.object === "page" ) {
        data.entry.forEach( ( pageEntry ) => {
            pageEntry.messaging.forEach( ( messagingEvent ) => {
                console.log( "what is msgevent.msg?", messagingEvent.message );
                if ( messagingEvent.message ) {
                    receivedMessage( messagingEvent );
                } else if ( messagingEvent.delivery ) {
                    receivedDeliveryConfirmation( messagingEvent );
                } else if ( messagingEvent.postback ) {
                    receivedPostback( messagingEvent );
                } else if ( messagingEvent.read ) {
                    receivedMessageRead( messagingEvent );
                } else {
                    console.log( "Webhook received unknown messagingEvent: ", messagingEvent );
                }
            } );
        } );

        res.sendStatus( 200 ); // send back a 200 within 20 seconds.
    }
} );

const verifyRequestSignature = ( req, res, buf ) => {
    const signature = req.headers[ "x-hub-signature" ];

    if ( !signature ) {
        console.error( "Couldn't validate the signature." );
    } else {
        const elements = signature.split( "=" );
        const signatureHash = elements[ 1 ];

        const expectedHash = crypto.createHmac( "sha1", APP_SECRET )
                        .update( buf )
                        .digest( "hex" );

        if ( signatureHash !== expectedHash ) {
            throw new Error( "Couldn't validate the request signature." );
        }
    }
};

// TODO: Seperate auth in different folder so can import
app.use( bodyParser.json( { verify: verifyRequestSignature } ) );

/*
 * Message Event
 *
 * This event is called when a message is sent to your page. The 'message'
 * object format can vary depending on the kind of message that was received.
 * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
 *
 * For this example, we're going to echo any text that we get. If we get some
 * special keywords ('button', 'generic', 'receipt'), then we'll send back
 * examples of those bubbles to illustrate the special message bubbles we've
 * created. If we receive a message with an attachment (image, video, audio),
 * then we'll simply confirm that we've received the attachment.
 *
 */
function receivedMessage( event ) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;

    console.log( "Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage );
    console.log( 'what is message received?', message );
    const isEcho = message.is_echo;
    const messageId = message.mid;
    const appId = message.app_id;
    const metadata = message.metadata;

  // You may get a text or attachment but not both
    const messageText = message.text;
    const messageAttachments = message.attachments;
    const quickReply = message.quick_reply;

    if ( isEcho ) {
    // Just logging message echoes to console
        console.log( "Received echo for message %s and app %d with metadata %s",
        messageId, appId, metadata );
        return;
    } else if ( quickReply ) {
        const quickReplyPayload = quickReply.payload;
        console.log( "Quick reply for message %s with payload %s",
        messageId, quickReplyPayload );

        sendTextMessage( senderID, "Quick reply tapped" );
        return;
    }

    if ( messageText ) {
    // If we receive a text message, check to see if it matches any special
    // keywords and send back the corresponding example. Otherwise, just echo
    // the text we received.
        switch ( messageText ) {
    //   case 'image':
    //     sendImageMessage(senderID);
    //     break;

    //   case 'gif':
    //     sendGifMessage(senderID);
    //     break;

    //   case 'audio':
    //     sendAudioMessage(senderID);
    //     break;

    //   case 'video':
    //     sendVideoMessage(senderID);
    //     break;

    //   case 'file':
    //     sendFileMessage(senderID);
    //     break;

    //   case 'button':
    //     sendButtonMessage(senderID);
    //     break;

    //   case 'generic':
    //     sendGenericMessage(senderID);
    //     break;

    //   case 'receipt':
    //     sendReceiptMessage(senderID);
    //     break;

    //   case 'quick reply':
    //     sendQuickReply(senderID);
    //     break;

    //   case 'read receipt':
    //     sendReadReceipt(senderID);
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

/*
 * Delivery Confirmation Event
 *
 * This event is sent to confirm the delivery of a message. Read more about
 * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
 *
 */
function receivedDeliveryConfirmation( event ) {
    // const senderID = event.sender.id;
    // const recipientID = event.recipient.id;
    const delivery = event.delivery;
    const messageIDs = delivery.mids;
    const watermark = delivery.watermark;
    // const sequenceNumber = delivery.seq;

    if ( messageIDs ) {
        messageIDs.forEach( ( messageID ) => {
            console.log( "Received delivery confirmation for message ID: %s",
        messageID );
        } );
    }

    console.log( "All message before %d were delivered.", watermark );
}

/*
 * Postback Event
 *
 * This event is called when a postback is tapped on a Structured Message.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
 *
 */
function receivedPostback( event ) {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
    const payload = event.postback.payload;

    console.log( "Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback );

  // When a postback is called, we'll send a message back to the sender to
  // let them know it was successful
    sendTextMessage( senderID, "Postback called" );
}

/*
 * Message Read Event
 *
 * This event is called when a previously-sent message has been read.
 * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
 *
 */
function receivedMessageRead( event ) {
    // const senderID = event.sender.id;
    // const recipientID = event.recipient.id;

  // All messages before watermark (a timestamp) or sequence have been seen.
    const watermark = event.read.watermark;
    const sequenceNumber = event.read.seq;

    console.log( "Received message read event for watermark %d and sequence " +
    "number %d", watermark, sequenceNumber );
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
