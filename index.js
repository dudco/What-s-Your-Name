var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var multer = require('multer');

mongoose.connect('mongodb://localhost/wyn');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : true }));

var UserSchema = new mongoose.Schema({
    id : String,
    pass : String,
    name : String,
    phone : String,
    name_card : String
});

Users = mongoose.model('users', UserSchema);  

app.get('/', (req, res) => {
  res.send('express');
});

app.post('/login', (req, res) => {
  var id = req.param('id');
  var pass = req.param('pass');

  Users.findOne({id : id}, (err, result) => {
    if(err){
      console.log("DB ERR");
      throw err;
    }
    if(result){
      if(pass == result.pass){
        console.log("user " + result.name + " Login");
        res.send(200, result);
      }else{
	res.send(400, {comment :'No User'}); 
      }
    }else{
      res.send(400, {comment : 'No User'}); 
    }
  });
});

app.post('/reg', (req, res) => {
  Users.findOne({id : id}, (err, result) => {
    if(err){
      console.log("DB ERR");
      throw err;
    }
    if(result){
      console.log("User exist");
      res.send(400, {comment : 'User Exist'});
    }else{
      user = new Users({
        id : req.param('id'),
        pass : req.param('pass'),
        name : req.param('name'),
        phone : req.param('phone')
      });
      user.save((err)=>{
        if(err){
          console.log("DB Save ERR");
          throw err;
        }else{
          console.log("new User " + user.name);
	  res.send(200, user);
        }
      })
    }
  });
});


var upload = multer({
  dest : __dirname + '/public/images'
});
app.post('/upload/:id', upload.single('image'), (req, res) => {
  console.log(req.param('id'));
  console.log(req.file);
  Users.findOne({id : req.param('id')},(err, result) => {
    if(err){
      console.log("DB ERR");
      throw err;
    }
    if(result){
      console.log('Find Result');
      result.name_card = req.file.filename;
      result.save((err, upResult) => {
        if(err){
          console.log("DB Update ERR");
          throw err;
        }
        if(upResult){
          res.send(200, upResult);
        }else{
          res.send(400, {comment : 'DB Updtae ERR'});
        }
      })
    }
  })
});

app.get('/download/:img', (req,res) => {
  res.sendFile(__dirname + '/public/images/' + req.params.img);
});

app.listen(3000,()=>{
  console.log('listening on *:3000');
});
