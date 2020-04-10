var express = require('express');
var app = express();
var fs = require("fs");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("/*Mongodb connection Details*/", { useNewUrlParser: true,useUnifiedTopology: true 
}).then(console.log('connected')).catch(err=>console.log(err));

var db=mongoose.connection;
db.once('open', function callback () {
    console.log('Conntected To Mongo Database'+db);
});

var userDetails = new mongoose.Schema({
    name: String,
    id: String,
    Language: String,
    Framework: String
    }
    );

var Details = mongoose.model("Details", userDetails);



app.get('/', (req,res)=>res.send('Welcome to REST API'));

app.get('/listUsers',(req,res)=> Details.find((err,data)=>{if(err) res.send(err); res.send(data)}));

app.get('/user/:id',(req,res)=>{
    Details.find({id:req.params.id},(err,data)=>{if(err) {res.send(err)} res.send(data)});
});

app.delete('/del/:id',(req,res)=>{
    Details.deleteOne({id:req.params.id},(err,data)=>{if(err) res.send(err); res.send('User Deleted Successfully')})
});

app.post('/addUser',(req,res)=>{
    const usr = new Details({   id:req.body.id,
                    "name":req.body.name,
                    "password":req.body.password,
                    "profession":req.body.profession
                });
    console.log(usr);
    usr.save();
    res.send('User is added to the database');
});

app.get('/search/:name',(req,res)=>{
    Details.find({name:req.params.name},(err,data)=>{if(err) res.send(err); res.send(data)})
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("App listening at http://%s:%s", host, port)
})