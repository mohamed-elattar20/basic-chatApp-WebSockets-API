"use strict";

const Room = require("./Room");

class ChatUser {
  constructor(send, roomName) {
    this._send = send;
    this.room = Room.get(roomName);
    this.name = null;

    console.log(`created chat in ${this.room.name}`);
  }

  send(data) {
    try {
      this._send(data);
    } catch (err) {}
  }

  handleJoin(name) {
    this.name = name;
    this.room.join(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} joined "${this.room.name}".`,
    });
  }

  handleChat(text) {
    this.room.broadcast({
      name: this.name,
      type: "chat",
      text: text,
    });
  }

  handlePrivateChat(recipient, text) {
    const member = this.room.getMember(recipient);

    member.send(
      JSON.stringify({
        name: this.name,
        type: "priv-chat",
        text: text,
      })
    );
  }

  handleMessage(jsonData) {
    let msg = JSON.parse(jsonData);

    switch (msg.type) {
      case "join":
        this.handleJoin(msg.name);
        break;

      case "chat":
        this.handleChat(msg.text);
        break;

      case "get-members":
        this.handleGetMembers();
        break;

      case "change-username":
        this.handleChangeUsername(msg.text);
        break;

      case "priv-chat":
        this.handlePrivateChat(msg.recipient, msg.text);
        break;

      default:
        throw new Error(`bad message: ${msg.type}`);
    }
  }

  handleClose() {
    this.room.leave(this);
    this.room.broadcast({
      type: "note",
      text: `${this.name} left ${this.room.name}.`,
    });
  }

  handleGetMembers() {
    const members = this.room.getMembers();
    const memberNames = [];

    for (let member of members) {
      memberNames.push(member.name);
    }

    this.send(
      JSON.stringify({
        name: "In room",
        type: "chat",
        text: memberNames.join(", "),
      })
    );
  }

  changeUsername(username) {
    this.name = username;
  }

  handleChangeUsername(username) {
    const currentName = this.name;
    this.changeUsername(username);
    const updatedName = this.name;

    this.room.broadcast({
      name: "server",
      type: "chat",
      text: `The username for ${currentName} has changed to ${updatedName}`,
    });
  }
}

module.exports = ChatUser;
