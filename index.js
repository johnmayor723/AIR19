var express = require('express');
//const bodyParser = require('body-parser')
var app = express();
const Tracker = require("./models")
const mongoose = require("mongoose")
const path = require('path')
//const trackRouters = require('./routes')

//const DBURL = "mongodb+srv://admin:password@cluster0.gftg8.mongodb.net/?retryWrites=true&w=majority"
const DBURL = "mongodb+srv://admin:majoje1582@cluster0.cqudxbr.mongodb.net/?retryWrites=true&w=majority"

mongoose.connect(DBURL);



// set the view engine to ejs
app.set('view engine', 'ejs');
//app.set('view', path.join(__dirnamme, '/views'))
app.use(express.static("public"));
app.use(express.urlencoded())


//app.use('/api/trackroutes', trackRouters)
// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
  
res.render('index');
});

app.get('/create', function(req, res) {
 
    
  //
  res.render('createtracking');
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
    }
    res.render('error')
  })
  .catch(err=>{
    console.log('err')
  })
 // const my_d = "REF342800AR8"
  
  
  //res.send('error')
  
});

app.post('/create', function(req, res){
  let data = req.body
  
  const {sname, saddress, rname, paddress, pdate, ddate, clocation, tnumber}= data
  Tracker.create(data)
  .then(data=>{
    res.send(data)
  })
  .catch(err=>{
    console.log(err)
  })
})


app.listen(8080);
console.log('Server is listening on port 8080');