const app = require( "./app" );
const db = require( "./db/index" );

app.listen( app.get( "port" ), () => {
    console.log( "Fb chatbot is running on port", app.get( "port" ) );
} );
