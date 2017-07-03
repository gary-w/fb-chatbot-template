const express = require( "express" );
const request = require( "request" );
const bodyParser = require( "body-parser" );
const config = require( "config" );

const app = express();

app.set( "port", process.env.PORT || 1337 );
// app.set( "view engine", "ejs" );
// app.use( bodyParser.json( { verify: verifyRequestSignature } ) );
app.use( express.static( "public" ) );

const APP_SECRET = ( process.env.APP_SECRET ) ?
  process.env.APP_SECRET :
  config.get( "appSecret" );

// Arbitrary value used to validate a webhook
const VALIDATION_TOKEN = ( process.env.VALIDATION_TOKEN ) ?
  ( process.env.VALIDATION_TOKEN ) :
  config.get( "validationToken" );

// Generate a page access token for your page from the App Dashboard
const PAGE_ACCESS_TOKEN = ( process.env.PAGE_ACCESS_TOKEN ) ?
  ( process.env.PAGE_ACCESS_TOKEN ) :
  config.get( "pageAccessToken" );

// URL where the app is running (include protocol). Used to point to scripts and
// assets located at this address.
const SERVER_URL = ( process.env.SERVER_URL ) ?
  ( process.env.SERVER_URL ) :
  config.get( "serverURL" );

if ( !( APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL ) ) {
    console.error( "Missing config values" );
    process.exit( 1 );
}

// TODO: Error handling if not 200
app.get( "/", ( req, res ) => {
    res.status( 200 ).send( "This is a Fb chatbot." );
} );

app.get( "/fb_webhook", ( req, res ) => {

} );

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );
