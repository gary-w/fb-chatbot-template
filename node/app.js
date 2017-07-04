const express = require( "express" );
const bodyParser = require( "body-parser" );
const dotenv = require( "dotenv" );
const path = require( "path" );

const keys = require( "./keys.js" );
const auth = require( "./authorization" );
const events = require( "./messageEvents" );

const app = express();

dotenv.config( { path: path.join( __dirname, "../.env" ) } );
dotenv.load();

app.set( "port", process.env.PORT || 1337 );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { verify: auth.verifyRequestSignature } ) );
app.use( express.static( "public" ) );

const VALIDATION_TOKEN = keys.VALIDATION_TOKEN;

app.get( "/", ( req, res ) => {
    res.status( 200 ).send( "This is a Fb chatbot." );
} );

app.get( "/fb_webhook", ( req, res ) => {
    if ( req.query[ "hub.mode" ] === "subscribe" &&
      req.query[ "hub.verify_token" ] === VALIDATION_TOKEN ) {
        console.log( "Validating webhook" );
        res.status( 200 ).send( req.query[ "hub.challenge" ] );
    } else {
        console.error( "Failed validation. Make sure the validation tokens match." );
        res.sendStatus( 403 );
    }
} );

app.post( "/fb_webhook", ( req, res ) => {
    const data = req.body;

    if ( data.object === "page" ) {
        data.entry.forEach( ( pageEntry ) => {
            // TODO: Check if the message is intended for the page
            pageEntry.messaging.forEach( ( messagingEvent ) => {
                if ( messagingEvent.message ) {
                    events.receivedMessage( messagingEvent );
                } else if ( messagingEvent.postback ) {
                    events.receivedPostback( messagingEvent );
                } else {
                    console.log( "Webhook received unknown messagingEvent: ", messagingEvent );
                }
            } );
        } );

        res.sendStatus( 200 ); // send back a 200 within 20 seconds.
    }
} );

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );

module.exports = app;
