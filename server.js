const express= require('express');
const cors =require('cors');
const axios =require('axios');


const server=express();
PORT=3020
require('dotenv').config();
server.use(cors());
server.use(express.json());
const mongoose = require("mongoose");

mongoose.connect('mongodb://localhost:27017/Anime',{ useNewUrlParser: true, useUnifiedTopology: true });
const AnimeSchema = new mongoose.Schema ({
    name:String,
    img:String,
    level:String,
})
const AnimeModel = mongoose.model('Digimon ',AnimeSchema)


server.get('/test',testHandler)
server.get('/getData',getDataHandler)
server.post('/addmyFavirote',AddToMyFaviroteHandler)
server.get('/getmyFavData',getMyFavDataHandler)
server.delete('/deleteData/:id',deleteMyFavDataHandler)
server.put('/updateData/:id',updateMyFavDataHandler)

function updateMyFavDataHandler(req,res){
    let id=req.params.id;
    let newData=req.body;
    console.log(id,newData)
    AnimeModel.findOne({_id:id},(error,result)=>{
        result.name=newData.name;
        result.img=newData.img;
        result.level=newData.level;
        result.save()
        console.log(result)
        AnimeModel.find({},(e,data)=>{
            res.send(data)
            
        })

    })

}

function deleteMyFavDataHandler (req,res){
    let id =req.params.id;
    AnimeModel.remove({_id:id},(error,result)=>{
        AnimeModel.find({},(e,data)=>{
            console.log(data)
            res.send(data)
        })
    })
} 

function getMyFavDataHandler (req,res){
    
     AnimeModel.find({},(error,result)=>{
         console.log(result)
         res.send(result)
     })
}
function AddToMyFaviroteHandler(req,res){
    let item=req.body
    // console.log(item)
    let newItem= new AnimeModel({
        name:item.name,
        img:item.img,
        level:item.level,

    })
    newItem.save();
}

function getDataHandler(req,res){
    axios.get(`https://digimon-api.vercel.app/api/digimon`).then(result=>{
        res.send(result.data)

    })

}

function testHandler(req,res){
    res.send('this is a test route')
}

server.listen(PORT,()=>{
    console.log('I am active')
})