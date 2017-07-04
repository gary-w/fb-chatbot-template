const mongoose = require( "mongoose" );

const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/fb_chatbot_template";

mongoose.connect( dbUrl );
const db = mongoose.connection;

db.on( "error", ( err ) => {
    console.log( `There was an error with the database: ${ err } ` );
} );

db.once( "open", () => {
    console.log( "Database is running." );
} );

module.exports = db;
