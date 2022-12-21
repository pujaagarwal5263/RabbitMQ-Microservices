const express = require("express");
const router = require("./routes/router");
const app = express();
const amqp=require("amqplib")
require("./prod-connection")

var connection,channel;

app.use(express.json());
async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}
connect();

app.use(router)

app.listen(7002, () => {
    console.log(`Prod-Service at 7002`);
});

exports.channel= channel;