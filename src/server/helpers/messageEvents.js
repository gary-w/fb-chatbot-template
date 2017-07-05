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
    const isEcho = event.message.is_echo;

    actions.createGetStartedButton( senderID );

    const saveUserIfNew = userID => uh.ifUserIDExist( userID )
        .then( ( bool ) => {
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
        .then( () => {
            // Database doesn't store messages sent by the bot
            if ( !isEcho && messageText !== "list" ) {
                saveChatlogIfNew();
            }
        } );

        /**
         * Check if messageText is for ADDing or LISTing onto the todo list
         */
        if ( ifTextIncludeTerm( messageText, "add " ) ) {
            tdh.saveTodo( messageText, timeOfMessage );
            sendTextMessage( senderID, "Your item is added to the grocery list." );
        } else if ( ifTextIncludeTerm( messageText, "list" ) ) {
            return tdh.getAllTodo()
            .then( ( list ) => {
                const subject = "This is your grocery list: \n";
                const todo = subject.concat( "- ", list.join( "\n- " ) );
                sendTextMessage( senderID, todo );
            } )
            .catch( ( err ) => {
                console.log( `Error in parsing todo list: ${ err }` );
            } );
        } else {
            sendTextMessage( senderID, "Thanks for your message. Try adding groceries and then list them out." );
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
