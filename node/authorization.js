const keys = require( "./keys" );

const verifyRequestSignature = async ( req, res, buf ) => {
    try {
        const signature = req.headers[ "x-hub-signature" ];

        if ( !signature ) {
            console.error( "Couldn't validate the signature." );
        } else {
            const elements = signature.split( "=" );
            const signatureHash = elements[ 1 ];

            const expectedHash = crypto.createHmac( "sha1", await keys.APP_SECRET )
                            .update( buf )
                            .digest( "hex" );

            if ( signatureHash !== expectedHash ) {
                throw new Error( "Couldn't validate the request signature." );
            }
        }
    } catch ( err ) {
        res.status( 500 ).send( err.message );
    }
};

module.exports = {
    verifyRequestSignature,
};
