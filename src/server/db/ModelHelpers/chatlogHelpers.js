const Chatlog = require( "../Models/ChatlogModel" );
const mongoose = require( "mongoose" );

const Promise = require( "bluebird" );

Promise.promisifyAll( mongoose );

module.exports.ifMessageIDExist = ( messageID ) => {
    return Chatlog.findOneAsync( { messageID } )
    .then( ( chatlog ) => {
        if ( !chatlog ) {
            return false;
        }
        return true;
    } )
    .catch( ( err ) => {
        console.log( err );
    } );
};

module.exports.ifUserIDExist = userID => {
};

module.exports.saveChatlog = ( senderID, recipientID, timestamp, messageText, messageID ) => {
    return Chatlog( {
        message_id: messageID,
        text: messageText,
        timestamp,
        sender_id: senderID,
        recipient_id: recipientID,
    } ).saveAsync()
    .then( ( result ) => {
        console.log( `Success in saving chatlog: ${ result }` );
    } )
    .catch( ( err ) => {
        console.log( `Error in saving chatlog: ${ err }` );
    } );
};

module.exports.saveUser = ( userID ) => {

};
