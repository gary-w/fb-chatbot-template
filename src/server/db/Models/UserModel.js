const mongoose = require( "mongoose" );

const UserSchema = mongoose.Schema( {
    username: { type: String, unique: true },
} );

const User = mongoose.model( "User", UserSchema );

module.exports = User;
