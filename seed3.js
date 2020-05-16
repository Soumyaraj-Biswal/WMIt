var mongoose = require("mongoose");
var User = require("./models/user");
var Order = require("./models/orders");
var Cart = require("./models/cart");
  

function seedDB(id){}
    User.findById(id, function(err,seed)
    {
        if(err){
            console.log(err);
        }
        else{
            var order = new Order(
                {
                    items:[]
                }
            
            );
            var cart = new Cart({
                items:[]
            });
        cart.save(function(err, cart)
        {
            if(err)
                console.log(err);
            else
            {
                seed.cart = cart;
                seed.save();
            }
        });
        order.save(function(err, order){
            if(err)
                console.log(err);
            else{
                seed.orders = order;
                seed.save();
            }
        });
    }
});
module.exports= seedDB;