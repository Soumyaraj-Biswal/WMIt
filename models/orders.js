var mongoose = require("mongoose");

var orderSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cart: {type: Object, ref: 'Cart'},
    address: {type:String, required: true},
    name: {type: String, required: true},
    paymentId: {type: String, required: true}

});

module.exports = mongoose.model("Order", orderSchema);
