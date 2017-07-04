const mongoose = require( "mongoose" );

const Schema = mongoose.Schema;

const AddressSchema = mongoose.Schema( {
    full_address: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
} );

const AddressLogs = mongoose.model( "Address", AddressSchema );

module.exports = AddressLogs;
