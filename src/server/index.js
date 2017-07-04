const app = require( "./app" );
// TODO: Need to require database index.js

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );
