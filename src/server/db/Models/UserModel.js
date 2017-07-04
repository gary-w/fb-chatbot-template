const mongoose = require( "mongoose" );

const UserSchema = mongoose.Schema( {
    user_id: { type: String, unique: true },
} );

const User = mongoose.model( "User", UserSchema );

module.exports = User;
