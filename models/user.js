var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var userSchema = new mongoose.Schema({
    user: String,
    username: String,
    password: String,
    address: String,
    cart:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"}
    ],
    order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);