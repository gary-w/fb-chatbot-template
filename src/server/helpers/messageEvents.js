const send = require( "./actions" );
const clh = require( "../db/ModelHelpers/chatlogHelpers" );
const uh = require( "../db/ModelHelpers/userHelpers" );
const tdh = require( "../db/ModelHelpers/todoHelpers" );
const actions = require( "../helpers/actions" );

const sendTextMessage = send.sendTextMessage;

const ifTextIncludeTerm = ( text, term ) => {
    const messageText = text.toLowerCase().trim();
    return !!messageText.includes( term );
};

const receivedMessage = ( event ) => {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfMessage = event.timestamp;
    const message = event.message;

    console.log( "Received message for user %d and page %d at %d with message:",
    senderID, recipientID, timeOfMessage );

    const messageText = message.text;
    const messageAttachments = message.attachments;
    const messageID = message.mid;

    actions.createGetStartedButton( senderID );

    const saveUserIfNew = userID => uh.ifUserIDExist( userID )
        .then( ( bool ) => {
            console.log( "bool???", bool );
            if ( !bool ) {
                return uh.saveUser( userID );
            }
            return true;
        } )
        .catch( ( err ) => {
            console.log( `Error in saving if user is new: ${ err }` );
        } );

    const saveChatlogIfNew = () => clh.ifMessageIDExist( messageID )
        .then( ( bool ) => {
            if ( !bool ) {
                return clh.saveChatlog( senderID, recipientID, timeOfMessage, messageText, messageID );
            }
            return true;
        } )
        .catch( ( err ) => {
            console.log( `Erorr in saving if message is new: ${ err }` );
        } );

    // TODO: Ignore messages sent by the bot (is_echo)
    if ( messageText ) {
        // Store received message to database
        saveUserIfNew( senderID )
        .then( () => saveUserIfNew( recipientID ) )
        .then( () => saveChatlogIfNew() );

        switch ( true ) {
        case ifTextIncludeTerm( messageText, "add " ):
            // TODO: Add back owner and messageId
            tdh.saveTodo( messageText, timeOfMessage );
            break;
        case ifTextIncludeTerm( messageText, "list " ):
            tdh.getAllTodo();
            break;
        default:
            console.log( "Message text doesn't contain add or list." );
        }

        switch ( messageText ) {
        default:
            sendTextMessage( senderID, "Your message is received." );
        }
    } else if ( messageAttachments ) {
        sendTextMessage( senderID, "Thanks for your message! We'll let you know when we support non-text content." );
    }
};

const receivedPostback = ( event ) => {
    const senderID = event.sender.id;
    const recipientID = event.recipient.id;
    const timeOfPostback = event.timestamp;
    const payload = event.postback.payload;

    console.log( "Received postback for user %d and page %d with payload '%s' " +
    "at %d", senderID, recipientID, payload, timeOfPostback );

    actions.createGetStartedButton( senderID );

    if ( payload !== "GET_STARTED_PAYLOAD" ) {
        sendTextMessage( senderID, "Postback called" );
    } else {
        // TODO: Use Facebook's in-built setGreetingText
        sendTextMessage( senderID, "Hey, ask me anything!" );
    }
};

module.exports = {
    receivedMessage,
    receivedPostback,
};
