const Chatlog = require( "../Models/ChatlogModel" );
const User = require( "../Models/UserModel" );
const mongoose = require( "mongoose" );

const Promise = require( "bluebird" );

Promise.promisifyAll( mongoose );

module.exports.ifMessageIDExist = messageID => Chatlog.findOneAsync( { messageID } )
    .then( ( chatlog ) => {
        if ( !chatlog ) {
            return false;
        }
        return true;
    } )
    .catch( ( err ) => {
        console.log( `Error in checking if message ID exist: ${ err }` );
    } );

module.exports.findUserObjID = userID => User.findOneAsync( { user_id: userID } )
    .then( ( user ) => {
        console.log( "whats this user result? ", user );
        console.log( "whats this user OBJ ID result? ", user._id );
        return user._id;
    } )
    .catch( ( err ) => {
        console.log( `Error in finding user object ID: ${ err }` );
    } );

module.exports.saveChatlog = ( senderID, recipientID, timestamp, messageText, messageID ) => {
    const chatlog = {
        message_id: messageID,
        text: messageText,
        timestamp,
        sender_id: undefined,
        recipient_id: undefined,
    };

    const getSenderObjID = userID => this.findUserObjID( userID )
    .then( ( objID ) => {
        chatlog.sender_id = objID;
    } )
    .catch( ( err ) => {
        console.log( `Error in getting sender obj ID: ${ err }` );
    } );

    const getRecipientObjID = userID => this.findUserObjID( userID )
    .then( ( objID ) => {
        chatlog.recipient_id = objID;
    } )
    .catch( ( err ) => {
        console.log( `Error in getting recipient obj ID: ${ err }` );
    } );

    getSenderObjID( senderID )
    .then( () => getRecipientObjID( recipientID ) )
    .then( () => Chatlog( chatlog ).saveAsync()
    .then( ( result ) => {
        console.log( `Success in saving chatlog: ${ result }` );
    } )
    .catch( ( err ) => {
        console.log( `Error in saving chatlog: ${ err }` );
    } ) );
};
