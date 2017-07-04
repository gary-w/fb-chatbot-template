const keys = require( "./keys" );
const events = require( "./messageEvents" );

const VALIDATION_TOKEN = keys.VALIDATION_TOKEN;

const validatePageAndToken = async ( req, res ) => {
    try {
        if ( req.query[ "hub.mode" ] === "subscribe" &&
        req.query[ "hub.verify_token" ] === VALIDATION_TOKEN ) {
            console.log( "Validating webhook" );
            res.status( 200 ).send( req.query[ "hub.challenge" ] );
        } else {
            console.error( "Failed validation. Make sure the validation tokens match." );
        }
    } catch ( err ) {
        res.status( 403 ).send( err.message );
    }
};

const routeMessageEvents = async ( req, res ) => {
    const data = req.body;
    try {
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
    } catch ( err ) {
        res.status( 500 ).send( err.message );
    }
};

module.exports = {
    validatePageAndToken,
    routeMessageEvents,
};
