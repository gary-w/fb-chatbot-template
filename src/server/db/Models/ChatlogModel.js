const mongoose = require( "mongoose" );

const ChatlogSchema = mongoose.Schema( {
    message_id: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    // sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
} );

const Chatlog = mongoose.model( "Address", ChatlogSchema );

module.exports = Chatlog;
