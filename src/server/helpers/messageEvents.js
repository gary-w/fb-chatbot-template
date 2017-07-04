const send = require( "./actions" );

const sendTextMessage = send.sendTextMessage;

const receivedMessage = ( event ) => {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;
    console.log( "---senderID:", senderID );
    console.log( "---recipientID", recipientID );
    console.log( "---time of msg", timeOfMessage );
    console.log( "---message text", message.text );

    console.log( "Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage );

    const messageText = message.text;
    const messageAttachments = message.attachments;

    // TODO: Ignore messages sent by the bot (is_echo)
    // TODO: Ignore messages with non-text content
    // TODO: Have good handling if unexpected payload
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
};

const receivedPostback = ( event ) => {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;
    const payload = event.postback.payload;

    console.log( "Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback );

    sendTextMessage( senderID, "Postback called" );
};

module.exports = {
    receivedMessage,
    receivedPostback,
};
