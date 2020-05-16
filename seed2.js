var mongoose = require("mongoose");
var Product = require("./models/products");
var User = require("./models/user");
var Order = require("./models/orders");
var Cart = require("./models/cart");
  

function seedDB(){
    //remove all campgrounds
    User.find({}, function(err, users){
        if(err){
            console.log(err);
        }

    
    //add few products
        users.forEach(function(seed){
            Product.create({
                name:"mario" ,
                pic:"https://images.unsplash.com/photo-1566576912325-fde224c9a1af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" ,
                price:10,
                description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
                quantity: 200
            },function(err,product){
                if(err){
                    console.log(err);
                }else{
                    console.log("added product");
                    var order = new Order({
                        items:[]
                    });
                    var cart = new Cart({
                        items:[]
                    });
                    cart.items.push(product);
                    cart.save(function(err, cart){
                        if(err)
                        console.log(err);
                        else{
                        seed.cart = cart;
                        seed.save();
                    }
                });
                    order.items.push({product:product,status:"Ordered"});
                    order.save(function(err, order){
                        if(err)
                        console.log(err);
                        else{
                        seed.orders = order;
                        seed.save();
                    }
                });

                }
            }
            );
                
            });
        });
    }
module.exports= seedDB;