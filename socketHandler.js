// Modules required for chat messages
const Message = require("./db/models/Message");
const inputValidation = require("./utils/validateInput");

module.exports = socket => {
  // Sending messages
  socket.on("send_message", message => {
    const inputErrors = inputValidation.message(message);
    if (!inputErrors) {
      Message.create({
        user_id: message.userId,
        recipient_user_id: message.recipientUserId,
        body: message.body
      })
        .then(result => {
          socket.emit("receive_message", result);
        })
        .catch(err => console.error(err));
    }
  });
  socket.on("request_messages", data => {
    Message.findAll({
      where: { user_id: data.userId, recipient_user_id: data.recipientUserId }
    })
      .then(messages => {
        if (messages) {
          messages.forEach(message => {
            socket.emit("receive_message", message);
          });
        } else {
          socket.emit("receive_message", false);
        }
      })
      .catch(err => console.error(err));
  });
  socket.on("delete_messages", data => {
    Message.findAll({
      where: { user_id: data.userId, recipient_user_id: data.recipientUserId }
    }).then(messages => {
      if (messages) {
        messages.forEach(message => {
          message.destroy();
        });
        socket.emit("messages_deleted", true);
      } else {
        socket.emit("messages_deleted", false);
      }
    });
  });
};
