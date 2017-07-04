const config = require( "config" );
const dotenv = require( "dotenv" );
const path = require( "path" );

dotenv.config( { path: path.join( __dirname, "../../../.env" ) } );
dotenv.load();

const APP_SECRET = ( process.env.APP_SECRET ) ?
  process.env.APP_SECRET :
  config.get( "appSecret" );

const VALIDATION_TOKEN = ( process.env.VALIDATION_TOKEN ) ?
  ( process.env.VALIDATION_TOKEN ) :
  config.get( "validationToken" );

const PAGE_ACCESS_TOKEN = ( process.env.PAGE_ACCESS_TOKEN ) ?
  ( process.env.PAGE_ACCESS_TOKEN ) :
  config.get( "pageAccessToken" );

const SERVER_URL = ( process.env.SERVER_URL ) ?
  ( process.env.SERVER_URL ) :
  config.get( "serverURL" );

// Optional if you want to run the chatbot using local server
const MONGODB_URI = ( process.env.MONGODB_URI ) ?
( process.env.MONGODB_URI ) :
config.get( "mongodbURI" );

if ( !( APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL ) ) {
    console.error( "Missing config values" );
    process.exit( 1 );
}

module.exports = {
    APP_SECRET,
    VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN,
    SERVER_URL,
    MONGODB_URI,
};
