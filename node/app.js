const express = require( "express" );
const bodyParser = require( "body-parser" );
const dotenv = require( "dotenv" );
const path = require( "path" );

const auth = require( "./authorization" );
const rh = require( "./request_handlers" );

const app = express();

dotenv.config( { path: path.join( __dirname, "../.env" ) } );
dotenv.load();

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
