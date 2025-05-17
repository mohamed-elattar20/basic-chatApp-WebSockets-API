"use strict";
// this is for persistent rooms
const rooms = new Map();

class Room {
  static get(roomName) {
    if (!rooms.has(roomName)) {
      rooms.set(roomName, new Room(roomName));
    }

    return rooms.get(roomName);
  }

  constructor(roomName) {
    this.name = roomName;
    this.members = new Set();
  }

  join(member) {
    this.members.add(member);
  }

  leave(member) {
    this.members.delete(member);
  }

  broadcast(data) {
    for (let member of this.members) {
      member.send(JSON.stringify(data));
    }
  }

  getMembers() {
    return this.members;
  }

  getMember(name) {
    for (let member of this.members) {
      if (member.name === name) return member;
    }
  }
}

module.exports = Room;
