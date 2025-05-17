const urlParts = document.URL.split("/");
const roomName = urlParts.at(-1);
let socket = new WebSocket(`ws://localhost:3000/chat/${roomName}`);
const username = prompt("Enter your username.  (no spaces)");

socket.onopen = (evt) => {
  console.log("WEB SOCKET OPENED!!!");
  const data = { type: "join", name: username };
  socket.send(JSON.stringify(data));
};

socket.onmessage = (evt) => {
  console.log("NEW MESSAGE", evt);
  let msg = JSON.parse(evt.data);

  switch (msg.type) {
    case "note":
      const item = document.createElement("li");
      const text = document.createElement("i");
      text.textContent = msg.text;
      item.appendChild(text);
      document.querySelector("#messages").appendChild(item);
      break;

    case "chat":
      const chatItem = document.createElement("li");
      chatItem.innerHTML = `<b>${msg.name}:</b> ${msg.text}`;
      document.querySelector("#messages").appendChild(chatItem);
      break;
  }
};

socket.onerror = (evt) => {
  console.log("SOMETHING WENT WRONG!");
  console.log(evt);
};

socket.onclose = (evt) => {
  console.log("WEB SOCKET HAS BEEN CLOSED!!!!");
};

document.querySelector("#msg-form").addEventListener("submit", (evt) => {
  evt.preventDefault();
  const input = document.querySelector("#messageInput");
  const payload = JSON.stringify({ type: "chat", text: input.value });
  socket.send(payload);
  input.value = "";
});
