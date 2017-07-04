const mongoose = require( "mongoose" );

const TodoSchema = mongoose.Schema( {
    List: [ {
        text: { type: String, required: true },
        log: { type: mongoose.Schema.Types.ObjectId, ref: "Chatlog", required: true },
        date: { type: Date, default: Date.now },
    } ],
} );

const Todo = mongoose.model( "Address", TodoSchema );

module.exports = Todo;
