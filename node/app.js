const express = require( "express" );
const request = require( "request" );
const bodyParser = require( "body-parser" );

const app = express();

app.set( "port", process.env.PORT || 1337 );
// app.set( "view engine", "ejs" );
// app.use( bodyParser.json( { verify: verifyRequestSignature } ) );
app.use( express.static( "public" ) );

// TODO: Error handling if not 200
app.get( "/", ( req, res ) => {
    res.status( 200 )
       .send( "This is a Fb chatbot." );
} );

app.get( "/test", ( req, res ) => {
    res.send( "hello..." );
} );

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );
