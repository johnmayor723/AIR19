var express = require('express');
//const bodyParser = require('body-parser')
var app = express();
const Tracker = require("./models")
const mongoose = require("mongoose")
const path = require('path')
const  methodOverride = require("method-override");
const connectEnsureLogin = require('connect-ensure-login');
const passport = require('passport');
const LocalStrategy = require('passport-local')

const session = require('express-session');
//const trackRouters = require('./routes')
const User = require('./models/user')

//const DBURL = "mongodb+srv://admin:password@cluster0.gftg8.mongodb.net/?retryWrites=true&w=majority"
const DBURL = "mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURL);



// set the view engine to ejs
app.set('view engine', 'ejs');
//app.set('view', path.join(__dirnamme, '/views'))
app.use(express.static("public"));
app.use(express.urlencoded())
// Set up session
app.use(methodOverride('_method'));
app.use(
  session({
    secret: "mooohdhfhgfgfggggbb55544@@!@#$$FTtvsvv4435ffv",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//app.use('/api/trackroutes', trackRouters)
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  
res.render('index');
});

app.get('/admin', function(req, res) {
  if(req.user && req.user.isAdmin === true){
    console.log(req.user)
    Tracker.find()
    .then(data=>{
      
       res.render('createtracking', {data});
    })
  } else{
    res.render("unauth")
  }
    
 
});
// about page
app.get('/about', function(req, res) {
  res.render('about');
});
app.get('/tracking', function(req, res) {
  res.render('tracking');
});
app.get('/contact', function(req, res) {
  res.render('contact');
});
app.get('/service', function(req, res) {
  res.render('service');
});

app.post('/tracking', function(req, res) {
  var my_data = req.body.trackingid
  Tracker.findOne({tnumber:my_data})
  .then(data=>{
    if ( my_data == data.tnumber){
      res.render('tracking', {data});
      console.log(data)
    } else {
      res.render('error')
    }
   
  })
  .catch(err=>{
    console.log('err')
  })
 // const my_d = "REF342800AR8"
  
  
  //res.send('error')
  
});

app.get("/campgrounds/:id", function(req, res){
 
  var id = req.params.id
  
  Tracker.findById({_id:id})
  .then(data=>{
   
   res.render('edittracking', {data})
  })

})
app.put('/campgrounds/:id', async (req, res) => {
  const {id} = req.params;
  const rid ={_id:id}
  let data = req.body
  
  console.log(data)
  await Tracker.findByIdAndUpdate(id, {...data})
  .then(newdata=>{
    res.redirect('/admin')
    console.log(newdata)
  })
  
 
  
  /*await Tracker.create(data)
  .then(newdata=>{
    res.redirect('/admin')
    console.log(newdata)
  })*/
  
})
app.delete('/campgrounds/:id', async (req, res) => {
  await Tracker.findOneAndDelete(req.params.id)

  res.redirect('/admin')
})
app.post('/create', function(req, res){
  let data = req.body
  
  const {sname, saddress, rname, paddress, pdate, ddate, clocation, tnumber}= data
  Tracker.create(data)
  .then(data=>{
    res.redirect("/admin")
  })
  .catch(err=>{
    console.log(err)
  })
})

//editing tracking



app.get("/register", function(req, res){
  res.render("register"); 
});
app.post("/register", function(req, res){
  var newUser = new User({username: req.body.username,pin:req.body.pin });
  const AdminPin = "AC1582"
  let name = newUser.username
  if (req.body.pin == AdminPin){
     newUser.isAdmin = true
     User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, function(){
        // req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
         res.render('user', {username:name})
         console.log(newUser)
      });
  });
  } else{
    User.register(newUser, req.body.password, function(err, user){
      if(err){
          console.log(err);
          return res.render("register", {error: err.message});
      }
      passport.authenticate("local")(req, res, function(){
        // req.flash("success", "Successfully Signed Up! Nice to meet you " + req.body.username);
         res.render('user', {username:name})
         console.log(newUser)
      });
  });
  }
  
  
});
//show login form
app.get("/login", function(req, res){
  res.render("login", {page: 'login'}); 
});

//handling login logic
app.post("/login", passport.authenticate("local", 
   {
       successRedirect: "/",
       failureRedirect: "/login",
       
   }), function(req, res){
});

// logout route
app.get("/logout", function(req, res){
  req.logout();
  req.flash("success", "See you later!");
  res.redirect("/campgrounds");
});


app.listen(8080);
console.log('Server is listening on port 8080');