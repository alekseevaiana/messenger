const onlineUsers = require("./onlineUsers");
const { User } = require("./db/models");
const jwt = require("jsonwebtoken");

let io = null;

module.exports.getIo = function () {
  return io;
};

function checkAuth(token) {
  const decoded = jwt.verify(token, process.env.SESSION_SECRET);
  try {
    return User.findOne({ where: { id: decoded.id } });
  } catch (e) {
    return null;
  }
}

module.exports.connect = function (server) {
  io = require("socket.io")(server);

  io.on("connection", (socket) => {
    socket.on("go-online", async (payload) => {
      const user = await checkAuth(payload.token);
      if (!user) {
        return;
      }

      const id = payload.data;
      socket.join("user:" + id);

      onlineUsers[id] = true;
      // send the user who just went online to everyone else who is already online
      socket.broadcast.emit("add-online-user", id);
    });

    socket.on("new-message", async (payload) => {
      const user = await checkAuth(payload.token);
      if (!user) {
        return;
      }
      const { data } = payload;
      socket.to("user:" + data.recipientId).emit("new-message", {
        message: data.message,
        sender: data.sender,
      });
    });

    socket.on("logout", async (payload) => {
      const user = await checkAuth(payload.token);
      if (!user) {
        return;
      }
      const id = payload.data;
      if (onlineUsers[id]) {
        onlineUsers[id] = false;
        socket.broadcast.emit("remove-offline-user", id);
      }
    });
  });
};
