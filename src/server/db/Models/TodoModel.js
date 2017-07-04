const mongoose = require( "mongoose" );

const TodoSchema = mongoose.Schema( {
    List: [ {
        text: { type: String, required: true },
        message_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chatlog", required: true },
        timestamp: { type: String, required: true },
    } ],
} );

const Todo = mongoose.model( "Address", TodoSchema );

module.exports = Todo;
