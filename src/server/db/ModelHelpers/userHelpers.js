const User = require( "../Models/UserModel" );
const mongoose = require( "mongoose" );

const Promise = require( "bluebird" );

Promise.promisifyAll( mongoose );

module.exports.ifUserIDExist = userID => {
    return User.findOneAsync( { user_id: userID } )
    .then( ( user ) => {
        if ( !user ) {
            return false;
        }
        return true;
    } )
    .catch( ( err ) => {
        console.log( `Error in checking if user ID exist: ${ err }` );
    } );
};

module.exports.saveUser = userID => {
    return User( {
        user_id: userID,
    } ).saveAsync()
    .then( ( result ) => {
        console.log( `Success in saving user: ${ result }` );
    } )
    .catch( ( err ) => {
        console.log( `Error in saving user: ${ err }` );
    } );
};
