const List = require( "../Models/ListModel" );
const mongoose = require( "mongoose" );

const Promise = require( "bluebird" );

Promise.promisifyAll( mongoose );

module.exports.saveTodo = ( messageText, timestamp ) => {
    const task = messageText.slice( 4 );
    return List( {
        text: task,
        timestamp,
    } ).saveAsync()
    .then( ( result ) => {
        console.log( `Success in saving todo: ${ result }` );
    } )
    .catch( ( err ) => {
        console.log( `Error in saving todo: ${ err }` );
    } );
};

module.exports.getAllTodo = () => {
    const result = [];
    return List.findAsync()
    .then( ( tasks ) => {
        tasks.forEach( ( task ) => {
            result.push( task.text );
        } );
        return result;
    } )
    .catch( ( err ) => {
        console.log( `Error in getting all todo: ${ err }` );
    } );
};
