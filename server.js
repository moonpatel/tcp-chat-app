const net = require("node:net");

const server = net.createServer();
let clients = new Map();
server.on("connection", (socket) => {
    let username;
    console.log("A user connected to the server");

    socket.on("data", (data) => {
        let dataString = data.toString("utf-8");
        if (dataString.substring(0, 10) === "username--") {
            username = dataString.substring(10);
            clients.set(username, socket);
            clients.forEach((s) => {
                s.write(`${username} joined!`);
            });
        } else {
            let username, message;
            [username, message] = dataString.split("--message--");
            clients.forEach((s) => {
                s.write(`${username}> ${message}`);
            });
        }
    });
    socket.on("error", (err) => {
        if (err?.code === "ECONNRESET") {
            console.log("client disconnected");
        } else {
            throw err;
        }
    });
    socket.on("close", () => {
        clients.delete(username);
        clients.forEach((s) => {
            s.write(`User ${username} left!`);
        });
    });
});

server.listen(3000, "127.0.0.1", () => {
    console.log("Server started", server.address());
});
