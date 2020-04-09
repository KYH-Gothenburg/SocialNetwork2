const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    from: String,
    to: String,
    title: String,
    date: Date,
    body: String,
    read: Boolean
},
{collection: "Messages"}
);

const Message = mongoose.model("message", MessageSchema);
module.exports = Message;