"use strict";

const express = require("express");
const app = express();

app.use(express.static("static/"));

const ChatUser = require("./ChatUser");

const wsExpress = require("express-ws")(app);
app.ws("/chat/:roomName", function (ws, req, next) {
  try {
    const user = new ChatUser(ws.send.bind(ws), req.params.roomName);

    ws.on("message", function (data) {
      try {
        user.handleMessage(data);
      } catch (err) {
        console.error(err);
      }
    });

    ws.on("close", function () {
      try {
        user.handleClose();
      } catch (err) {
        console.error(err);
      }
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/:roomName", function (req, res, next) {
  res.sendFile(`${__dirname}/chat.html`);
});

module.exports = app;
