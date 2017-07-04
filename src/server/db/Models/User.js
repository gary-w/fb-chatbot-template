const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema( {
    username: { type: String, unique: true },
} );

const UserLogs = mongoose.model( "User", UserSchema );

module.exports = UserLogs;
