const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');
var mongoose = require("mongoose");
var cookieParser = require("cookie-parser");
var session = require("express-session");
var mongoStore = require("connect-mongo")(session);
const app = express();
var passport = require("passport");
var localStrategy = require("passport-local");
var Product = require("./models/products");
var Comment = require("./models/comments");
var User = require("./models/user");
var Cart = require("./models/cart");
var Order = require("./models/orders");

/* var seedDB = require("./seed"); */


app.set('view engine', 'ejs' );
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect('mongodb://127.0.0.1:27017/wmit_v4');

/* seedDB(); */
/* seedDB2(); */

//passport configuration
app.use(session({
  secret: "hey bro !",
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({mongooseConnection: mongoose.connection}),
  cookie:{ maxAge: 180 * 60 *1000}
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser = req.user;
  res.locals.session = req.session;
  next();
})



app.get("/",function(req,res){
  Product.find({}, function(err,products){
    if(err){
      console.log("3"+err);
    }else{
      res.render("home",{products:products});
    }
  })
});

app.get("/admin/submit",function(req,res){
  res.render("admin_page");
});

app.post("/admin/submit",function(req,res){
  var name = req.body.name;
  var pic = req.body.pic;
  var price = req.body.price;
  var description = req.body.description;
  var quantity = req.body.quantity;
  Product.create({
    name: name,
    pic: pic,
    price: price,
    description: description,
    quantity: quantity
  },function(err,product){
    if(err){
      console.log("2"+err);
    }else{
     res.redirect("/");
    }
  });
});

app.get("/user",isLoggedIn,function(req,res){
  Order.find({user: req.user},function(err,orders){
    if(err){
      console.log(err)
    }else{
      var cart;
      orders.forEach(function(order){
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
        console.log(order.items);
      });
      res.render("user",{orders: orders});

    }
  })
})

app.get("/product/:id",function (req,res){
  Product.findById(req.params.id).populate("comments").exec(function(err,foundProduct){
    if(err){
      console.log("1"+err);
    }else{
      res.render("product",{product:foundProduct});
    }
  })

});

app.get("/product/:id/comment", function(req,res){

    res.render("comment",{id:req.params.id});
});


app.post("/product/:id/comment", function(req,res){

  var comment = req.body.comment;
  Product.findById(req.params.id,function(err,pro){
    if(err){
      console.log(err);

    }
    else{
      Comment.create(
        {
          text : comment,
          
        },function(err,commen){
          if(err){
            console.log(err);
          }else{
            commen.author.id = req.user._id;
            commen.author.username = req.user.user;
            commen.save();
            pro.comments.push(commen);
            pro.save();
            res.redirect("/user");
          }
      });
    }
  })
  
});

app.get("/cart", function(req,res){
  
  if(!req.session.cart){
    return res.render('cart',{cart:null});
  }
  var cart = new Cart(req.session.cart);
  res.render("cart",{cart: cart.generateArray(), totalPrice: cart.totalPrice});
      
  });

/*
app.post("/cart/destroy",isLoggedIn, function(req,res){
   User.findById(req.user._id,function(err,user){
      if(err){
        console.log(err);
      }else{
        user.cart.pull(req.body.productToBeRemoved);
        user.save();
        res.redirect("/cart");
      }
    });
}); */

app.get("/product/:id/cart",function(req,res){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});
  Product.findById(productId, function(err, product){
    if(err){
      console.log(err);
      return res.redirect("/");
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    res.redirect("/");
  });

  /*   User.findById(req.user._id,function(err,user){
    if(err){
      console.log(err);
    }else{
      Product.findById(req.params.id,function(err,product){
        if(err){
          console.log(err);
        }else{
          user.cart.push(product);
          user.save();
          res.redirect("/cart");
        }
      });
    }
    
}); */
});


/* app.get("/order",isLoggedIn,function(req,res){
  
}); */

app.get('/reduce/:id', function(req,res){
  var cart = new Cart(req.session.cart ? req.session.cart: {});
  cart.reduceByOne(req.params.id);
  req.session.cart = cart;
  res.redirect("/cart");
});

app.get('/remove/:id', function(req,res){
    var cart = new Cart(req.session.cart ? req.session.cart: {});
    cart.removeItem(req.params.id);
    req.session.cart = cart;

    res.redirect("/cart");
})

app.get("/checkout",isLoggedIn,function(req,res){
  if(!req.session.cart){
    return res.redirect("/cart");
  }
  var cart = new Cart(req.session.cart);
  res.render("checkout",{total:cart.totalPrice});
})




app.post("/checkout",isLoggedIn,function(req,res){
  if(!req.session.cart){
    return res.redirect("/cart");
  }
  var cart = new Cart(req.session.cart);
  const stripe = require('stripe')('sk_test_m4X6GUFtz81SOh8jH8cfCKhT00PZBOZMNi');
  stripe.customers.create({
    name: req.body.cardholder,
    description: req.session.id,
    source: req.body.tokenKeeper,
    address: {
      line1: req.body.address,
      postal_code: req.body.pin,
      city: req.body.city,
      state: req.body.state,
      country: req.body.country
  }
},function(err,cust){
  if(err){
    console.log(err.message);
  }
    stripe.charges.create({
      customer: cust.id,
      amount: cart.totalPrice * 100,
      currency: 'inr',
      
      description:'Test charge'
  },function(err,charge){
      if(err){
        console.log(err.message);
        return res.redirect("/checkout");
      }
    var order = new Order({
      user: req.user,
      cart: cart,
      address: req.body.address +" ("+req.body.pin+") "+", "+req.body.city+", "+req.body.state+", "+req.body.country,
      name: req.body.cardholder,
      paymentId: charge.id
    });
    order.save(function(err, result){
      if(err){
        console.log(err)
      }
      else{
        console.log("success!");
        req.session.cart = null;
        res.redirect('/');
      }
    });
  });
});
  

});


//===========
//AUTH ROUTES
//===========

//show reg form

app.get("/register",notLoggedIn,function(req,res){
  res.render("signup");
});

app.post("/register",notLoggedIn,function(req,res){
  User.register(new User({username: req.body.username, user: req.body.user, address: req.body.address}), req.body.password, function(err,user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    
    passport.authenticate("local")(req,res,function(){
      if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
      }else{
        res.redirect("/user");
      } 
    });
  });
});

//Show login form
app.get("/login", notLoggedIn,function(req,res){
  res.render("login");
});

//handling login route
app.post("/login", notLoggedIn,passport.authenticate("local",{
  failureRedirect: "/login"
}), function(req,res){
  if(req.session.oldUrl){
    var oldUrl = req.session.oldUrl;
    req.session.oldUrl = null;
    res.redirect(oldUrl);
    
  }else{
    res.redirect("/user");
  }
});

//logout route
app.get("/logout",isLoggedIn,function(req,res){
  req.logout();
  res.redirect("/");
});


function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
      return next();
  }
  req.session.oldUrl = req.url;
  res.redirect("/login");
}
function notLoggedIn(req,res,next){
  if(!req.isAuthenticated()){
      return next();
  }
  res.render("/");
}

app.listen(3000, function() {
  console.log("Server started on port 3000");
});