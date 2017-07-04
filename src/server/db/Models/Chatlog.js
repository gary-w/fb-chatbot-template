const mongoose = require( "mongoose" );

const ChatlogSchema = mongoose.Schema( {
    Log: [ {
        text: { type: String, required: true },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, default: Date.now },
    } ],
} );

const Chatlog = mongoose.model( "Address", ChatlogSchema );

module.exports = Chatlog;
