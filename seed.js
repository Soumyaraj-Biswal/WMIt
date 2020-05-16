var mongoose = require("mongoose");
var Product = require("./models/products");
var Comment = require("./models/comments");


var products = [
    {   name:"mario" ,
        pic:"https://images.unsplash.com/photo-1566576912325-fde224c9a1af?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80" ,
        price:10,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 200
    },
    {
        name:"pokemon" ,
        pic:"https://images.unsplash.com/photo-1566577134631-0caa1af84209?ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80" ,
        price:20,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 400
    },
    {
        name:"street fighter" ,
        pic:"https://images.unsplash.com/photo-1566577134770-3d85bb3a9cc4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80", 
        price:30,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 300
    },
    {
        name: "Donkey kong",
        pic: "https://images.unsplash.com/photo-1566577134650-bbbca4ec35f7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjF9&auto=format&fit=crop&w=750&q=80", 
        price:40,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 500
    },
    {
        name: "Poker",
        pic: "https://images.unsplash.com/photo-1551368998-d349c755c74c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=749&q=80", 
        price:50,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 200
    },
    {
        name: "Chess",
        pic: "https://images.unsplash.com/photo-1556084123-fe76122cd5d3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=376&q=80", 
        price: 60,
        description: "Lorem ipsum dolor sit amet consectetur, adipisicing elit. Adipisci quisquam ipsam vel maiores recusandae pariatur tenetur voluptates cumque voluptate praesentium?",
        quantity: 700
    }
  ]


  

function seedDB(){
    //remove all campgrounds
    Product.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed product");
    
    //add few products
        products.forEach(function(seed){
            Product.create(seed,function(err,product){
                if(err){
                    console.log(err);
                }else{
                    console.log("added product");
                    //create comment
                    Comment.create(
                        {
                            text: "this place is awesom man 5 stars",
                            author: "Hommer"
                        },function(err, comment){
                            if(err){
                                console.log(err);
                            }else{
                                product.comments.push(comment);
                                product.save();
                                console.log("created new comment")
                            }
                        }
                    );
                }
            });
        });
    });
    //add comments
}
module.exports= seedDB;