const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require("path");
const multer = require("multer");

dotenv.config();
const db = process.env.DB;
const bodyParser = require('body-parser');
const router = express.Router();


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());
const File = require('./model'); 

app.get("/",(req,res)=>{
    res.send("jai ho maharaj");
})

const storage = multer.diskStorage({
    destination: "./public/",
    filename: function(req, file, cb){
       cb(null,"IMAGE-" + Date.now() + path.extname(file.originalname));
    }
 });

const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
 }).single("myfile");

const obj =(req,res) => {
    upload(req, res, () => {
       console.log("Request ---", req.body);
       console.log("Request file ---", req.file);//Here you get file.
       const file = new File();
       file.meta_data = req.file;
       file.save().then(()=>{
       res.send({message:"uploaded successfully"})
       })
       /*Now do where ever you want to do*/
    });
 }

router.post("/upload", obj);

app.use(router);

mongoose.connect(db,{useNewUrlParser:true}).then(()=>{console.log("connected");}).catch((err)=>{
    console.error(err);
})

app.listen(5000,()=>{
    console.log("runnimg port");
})