const mongoose = require( "mongoose" );

const ChatlogSchema = mongoose.Schema( {
    Log: [ {
        text: { type: String, required: true },
        sender_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recipient_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        message_id: { type: String, required: true },
        timestamp: { type: String, required: true },
    } ],
} );

const Chatlog = mongoose.model( "Address", ChatlogSchema );

module.exports = Chatlog;
