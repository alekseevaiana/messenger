const onlineUsers = require("./onlineUsers");

let io = null;

module.exports.connect = function connect(server) {
  io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("go-online", (id) => {
      socket.join("user:" + id);
      if (!onlineUsers.includes(id)) {
        onlineUsers.push(id);
      }
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit("add-online-user", id);
    });

    socket.on("new-message", (data) => {
      // XXX remove
      console.log("NEW MESSAGE", data);
      socket.to("user:" + data.recipientId).emit("new-message", {
        message: data.message,
        sender: data.sender,
      });
    });

    socket.on("logout", (id) => {
      if (onlineUsers.includes(id)) {
        userIndex = onlineUsers.indexOf(id);
        onlineUsers.splice(userIndex, 1);
        socket.broadcast.emit("remove-offline-user", id);
      }
    });

    socket.on("mark-read", (data) => {
      console.log("RECEIVED READ EVENT AND BROADCAST");
      socket.broadcast.emit("mark-read", data);
    });
  });
};
