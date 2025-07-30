const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDb = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json()); // for parsing application/json

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ✅ Setup socket.io
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173", // frontend origin
  },
});

// 🔌 Socket connection
io.on("connection", (socket) => {
  console.log("🔌 New socket connection");

  socket.on("setup",(UserData)=>{
    socket.join(UserData._id);
    console.log(UserData._id);
    socket.emit("connected");
  });

  socket.on("join chat",(room)=>{
    socket.join(room);
    console.log("User joined room: " + room);
  });

  socket.on("typing",(room)=>{
    socket.in(room).emit("typing")
  })
  socket.on("typing",(room)=>{
    socket.in(room).emit("typing")
  })
  socket.on("new message", (newMessageRecieved) => {
  const chat = newMessageRecieved.chat;

  if (!chat.users) return console.log("chat.users not defined");

  chat.users.forEach((user) => {
    if (user._id === newMessageRecieved.sender._id) return;

    socket.in(user._id).emit("message received", newMessageRecieved); // ✅ FIXED SPELLING
  });
});

socket.off("setup",()=>{
  console.log("User disconnected");
  socket.leave(userData._id);
})

});
