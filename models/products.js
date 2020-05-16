var mongoose = require("mongoose");

var productSchema = new mongoose.Schema({
   name: String,
   pic: String,
   price: Number,
   description: String,
   quantity: Number,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});

module.exports = mongoose.model("Product", productSchema);