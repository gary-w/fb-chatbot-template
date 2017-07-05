const mongoose = require( "mongoose" );

const TodoSchema = mongoose.Schema( {
    // owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    // message_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chatlog", required: true },
    timestamp: { type: String, required: true },
} );

const Todo = mongoose.model( "Todo", TodoSchema );

module.exports = Todo;
