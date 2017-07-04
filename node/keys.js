const config = require( "config" );

const APP_SECRET = ( process.env.APP_SECRET ) ?
  process.env.APP_SECRET :
  config.get( "appSecret" );

const VALIDATION_TOKEN = ( process.env.VALIDATION_TOKEN ) ?
  ( process.env.VALIDATION_TOKEN ) :
  config.get( "validationToken" );

const PAGE_ACCESS_TOKEN = ( process.env.PAGE_ACCESS_TOKEN ) ?
  ( process.env.PAGE_ACCESS_TOKEN ) :
  config.get( "pageAccessToken" );

const SERVER_URL = ( process.env.SERVER_URL ) ?
  ( process.env.SERVER_URL ) :
  config.get( "serverURL" );

if ( !( APP_SECRET && VALIDATION_TOKEN && PAGE_ACCESS_TOKEN && SERVER_URL ) ) {
    console.error( "Missing config values" );
    process.exit( 1 );
}

module.exports = {
    APP_SECRET,
    VALIDATION_TOKEN,
    PAGE_ACCESS_TOKEN,
    SERVER_URL,
};
