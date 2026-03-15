function personalChat(io, socket){

  socket.on("join_room",(roomId)=>{

    if(!roomId) return;

    socket.join(roomId);

    console.log("User joined room:",roomId);

  });

  socket.on("new_message",(data)=>{

    if(!data.roomId || !data.message) return;

    console.log("Personal message:",data.roomId);

    io.to(data.roomId).emit("receive_message",data);

  });

}

module.exports = personalChat;
