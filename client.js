const net = require("node:net");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const clearLine = (dir) => {
    return new Promise((resolve, reject) => {
        process.stdout.clearLine(dir, () => {
            resolve();
        });
    });
};

const moveCursor = (dx, dy) => {
    return new Promise((resolve, reject) => {
        process.stdout.moveCursor(dx, dy, () => {
            resolve();
        });
    });
};

const question = (question) => {
    return new Promise((resolve, reject) => {
        rl.question(question, (message) => {
            resolve(message);
        });
    });
};

let username;

const socket = net.createConnection({ host: "127.0.0.1", port: 3000 }, async () => {
    console.log("---Connection establised---");

    const getUsername = async () => {
        username = await question("Enter your username: ");
        socket.write(`username--${username}`);
    }
    getUsername();

    const ask = async () => {
        const message = await question("Enter a message: ");
        await moveCursor(0, -1);
        await clearLine(0);
        socket.write(`${username}--message--${message}`);
    };

    socket.on("data", async (data) => {
        let dataString = data.toString("utf-8");
        if (dataString.substring(0, 4) === "id--") {
            id = dataString.substring(4);
            console.log("Your id is", id);
        } else {
            console.log();
            await moveCursor(0, -1);
            await clearLine(0);
            console.log(dataString);
        }
        ask();
    });
});

socket.on("end", () => {
    console.log("socket disconnected");
});

socket.on("error", (err) => {
    if (err?.code === "ECONNRESET") {
        console.log("DISCONNECTED FROM SERVER!!!");
        process.exit();
    } else if (err?.code === "ECONNREFUSED") {
        console.log("SERVER DOWN!!!");
        process.exit();
    } else {
        console.log("An error occured");
        console.error(err);
    }
});
