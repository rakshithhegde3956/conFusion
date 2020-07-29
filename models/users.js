const mongoose = require('mongoose');

var passportlocalmongoose = require('passport-local-mongoose');

var schema = mongoose.Schema;

var User = new schema({
    firstName : {
        type: String,
        default: ''
    },
    lastName : {
        type: String,
        default: ''
    },
    admin : {
        type : Boolean,
        default : false
    }
});

User.plugin(passportlocalmongoose);

module.exports = mongoose.model('User', User);
