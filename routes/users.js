const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const url = 'mongodb://7kumala:pass7kumala@172.20.44.25/test';
let db;


mongodb.MongoClient.connect(url, function(err, client) {
  if (err) return console.log(err)
  db = client.db('7kumala');
  console.log('Connection to Mongo: OK');
});

router.get('/login', function(req, res, next) {
  res.render('login',{error: '', title: 'Logowanie'});
});

router.post('/login', (req,res,next)=>{
  let login = req.body['login'];
  let password = req.body['password'];
  let error="";
  db.collection('users').findOne({login: login}, (err, result)=>{
    if(err) {
      return console.log(err);
    }else if(result){
      if(result.password == password){
        req.session['login'] = login;
        res.json(JSON.stringify( {staus: 0})).end();
      }
      else {
        error = 'Błędne hasło';
        console.log(error);
        res.json(JSON.stringify( {staus: -1, message: error})).end();
      }
    }
    else{
      error = 'Podany login nie istnieje';
      console.log(error);
      res.json(JSON.stringify( {staus: -1, message: error})).end();
    }
  });
});

router.get('/register', (req, res,next)=>{
  res.render('register',{error: '', title: 'Rejestracja'});

});

router.post('/register', (req, res,next)=>{
  let login = req.body['login'];
  let password = req.body['password'][0];
  let confirmPassword = req.body['password'][1];
  let error="";

  db.collection('users').findOne({login: login}, (err, result)=>{
    if(err){
      error = 'Błąd połaczenia z bazą';
      console.log(error);
      res.json(JSON.stringify( {staus: -1, message: error})).end();
    }else if(result){
      error = 'Login jest już zajęty';
      console.log(error);
      res.json(JSON.stringify( {staus: -1, message: error})).end();
    }else if(password != confirmPassword){
      error = 'Hasła nie są zgodne';
      console.log(error);
      res.json(JSON.stringify( {staus: -1, message: error})).end();
    }else{
      db.collection('users').insertOne({login: login, password: password}, (err, result)=>{
        if(err){
          error = 'Błąd połaczenia z bazą';
          console.log(error);
          res.json(JSON.stringify( {staus: -1, message: error})).end();
        }else if(result){
          res.json(JSON.stringify( {staus: 0})).end();
        }
      })
    }
  });
});

router.get('/logout', (req,res,next)=>{
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;
