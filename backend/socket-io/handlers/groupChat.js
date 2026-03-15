function groupChat(io,socket){

  socket.on("join_group",(groupId)=>{

    if(!groupId) return;

    socket.join(groupId);

    console.log("User joined group:",groupId);

  });

  socket.on("group_message",(data)=>{

    if(!data.groupId || !data.message) return;

    console.log("Group message sent:",data.groupId);

    io.to(data.groupId).emit("receive_group_message",data);

  });

}

module.exports = groupChat;
