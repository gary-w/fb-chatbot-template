const express = require( "express" );
const bodyParser = require( "body-parser" );

const app = express();

const auth = require( "./requests/authorization" );
const rh = require( "./requests/request_handlers" );

app.set( "port", process.env.PORT || 1337 );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( bodyParser.json() );
app.use( bodyParser.json( { verify: auth.verifyRequestSignature } ) );
app.use( express.static( "public" ) );

app.route( "/fb_webhook" )
    .get( rh.validatePageAndToken )
    .post( rh.routeMessageEvents );

app.get( "/", ( req, res ) => {
    res.status( 200 ).send( "This is a Fb chatbot." );
} );

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );

module.exports = app;
