import { io } from "socket.io-client";
const socket = io("http://localhost:3001");

const accounts = ["Andrea", "Bob", "Catherine", "Doug"];
const actions = ["Buy", "Sell"];
let i = 0;

const autotrader = async (i: number) => {
  while (true) {
    const price = Math.floor(Math.random() * 100) / 10;
    const volume = Math.floor(Math.random() * 10);
    const binaryRandom = Math.floor(Math.random() * 2);
    const action = actions[binaryRandom];
    const username = accounts[i];

    const order = { username, action, volume, price };
    console.log(order);

    socket.emit("addOrder", JSON.stringify(order));

    i++;
    await new Promise((r) => setTimeout(r, 1000));
  }
};
