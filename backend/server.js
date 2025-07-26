const express=require("express");
const app=express();
const { chats } =require("./data/data");
const dotenv=require("dotenv");
dotenv.config();


app.get("/",(req,res)=>{
    res.send("API is running");
});

app.get("/api/chat",(req,res)=>{
    res.send(chats);
});

app.get("/api/chat/:id",(req,res)=>{
    const { id }=req.params;
    const chat=chats.find((c)=>c._id==id);
    res.send(chat);    
});




const PORT=process.env.PORT || 5000;

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
});


