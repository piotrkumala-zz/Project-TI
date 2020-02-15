const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const url = 'mongodb://7kumala:pass7kumala@172.20.44.25/test';
let db;


mongodb.MongoClient.connect(url, function(err, client) {
    if (err) return console.log(err);
    db = client.db('7kumala');
    console.log('Connection to Mongo: OK');
});

router.get('/', (req,res,next)=>{
    let auth = !!req.session.login;
    let error = "";
    if(auth){
        db.collection('weather').find().toArray((err, result)=>{
            if(err){
                error = 'Błąd połaczenia z bazą';
                console.log(error);
                res.json({status: -1, message: error}).end();
            }
            else{
                if(Array.isArray(result) && result.length <=0){
                    error = 'Baza pusta';
                    console.log(error);
                    res.json({status: -1, message: error}).end();
                }else{
                    res.json(result);
                }
            }
        });
    }
    else{
        error = "Musisz się zalogować do serwisu";
        res.json({status: -1, message:error}).end();
    }
});

router.get('/insert',(req, res,next)=>{
    res.render('insert', {title: 'Wprowadź dane', error: '', authorized: req.session.login?true:false });
});

router.post('/insert', (req,res,next)=>{
    let miejscowosc = req.body.miejscowosc;
    let data = req.body.data;
    let tempereratura = req.body.temperatura;
    let cisnienie = req.body.cisnienie;
    let wilgotnosc = req.body.wilgotnosc;
    db.collection('weather').insertOne({miejscowosc: miejscowosc, data: data, temperatura: tempereratura, cisnienie: cisnienie, wilgotnosc:wilgotnosc}, (err, result)=>{
        if(err){
            error = 'Błąd połaczenia z bazą';
            console.log(error);
            res.json({staus: -1, message: error}).end();
        }else if(result){
            res.json({staus: 0}).end();
        }
    });
});

router.post('/insertJSON', (req, res,next)=>{
    db.collection('weather').insertOne(req.body, (err, result)=>{
        if(err){
            error = 'Błąd połaczenia z bazą';
            console.log(error);
            res.json({staus: -1, message: error}).end();
        }else if(result){
            console.log("Udałó się");
            res.json({staus: 0}).end();
        }
    });
});


router.get('/charts', (req,res, next)=>{
    let auth = !!req.session.login;
    if (auth) {
        res.render('charts', {title: 'Wykresy', authorized: req.session.login?true:false });
    }
    else {
        error = 'Musisz się zalogować do serwisu';
        console.log(error);
        res.render('error', {message: error}).end();
    }
});


module.exports = router;
