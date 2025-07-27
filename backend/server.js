const express=require("express");
const app=express();
const { chats } =require("./data/data");
const dotenv=require("dotenv");
const cors = require('cors');
const connectDb=require("./config/db");
const userRoutes=require("./routes/userRoutes");


connectDb();

dotenv.config();

app.use(cors());

app.get("/",(req,res)=>{
    res.send("API is running");
});

app.use("/api/user",userRoutes);


const PORT=process.env.PORT || 5000;

app.listen(5000,()=>{
    console.log("Server is running on port 5000")
});


