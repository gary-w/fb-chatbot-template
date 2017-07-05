const express = require( "express" );
const bodyParser = require( "body-parser" );

const db = require( "./db/index" );
const auth = require( "./requests/authorization" );
const rh = require( "./requests/request_handlers" );
const actions = require( "./helpers/actions" );

const app = express();

/**
 * View engine setup
 */
app.set( "port", process.env.PORT || 1337 );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { verify: auth.verifyRequestSignature } ) );
app.use( express.static( "public" ) );

/**
 * Create "get started" button at messenger launch
 */
// actions.createGetStartedButton();

/**
 * Facebook Webhook
 */
app.route( "/fb_webhook" )
    .get( rh.validatePageAndToken )
    .post( rh.routeMessageEvents );

/**
 * Wildcard
 */
app.get( "*", ( req, res ) => {
    res.status( 200 ).send( "This is a Fb chatbot." );
} );

module.exports = app;
