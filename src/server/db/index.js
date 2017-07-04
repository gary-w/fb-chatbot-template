const mongoose = require( "mongoose" );
const keys = require( "../helpers/keys" );

const dbUrl = process.env.MONGODB_URI || keys.MONGODB_URI;

mongoose.connect( dbUrl );
const db = mongoose.connection;

db.on( "error", ( err ) => {
    console.log( `There was an error with the database: ${ err } ` );
} );

db.once( "open", () => {
    console.log( "Database is running." );
} );

module.exports = db;
