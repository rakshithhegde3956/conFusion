const mongoose = require('mongoose');

var passportlocalmongoose = require('passport-local-mongoose');

var schema = mongoose.Schema;

var User = new schema({
    admin : {
        type : Boolean,
        default : false
    }
});

User.plugin(passportlocalmongoose);

module.exports = mongoose.model('User', User);
