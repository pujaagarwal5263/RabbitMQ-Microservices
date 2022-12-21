const express = require("express");
const router = require("./routes/router");
const app = express();
const Order=require("./Order")
const amqp=require("amqplib")
require("./order-connection")

app.use(express.json());

function createOrder(products, userEmail) {
    let total = 0;
    for (let t = 0; t < products.length; ++t) {
        total += products[t].price;
    }
    const newOrder = new Order({
        products,
        user: userEmail,
        total_price: total,
    });
    newOrder.save();
    return newOrder;
}

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("ORDER");
}
connect().then(() => {
    channel.consume("ORDER", (data) => {
        console.log("Consuming ORDER service");
        const { products, userEmail } = JSON.parse(data.content);
        const newOrder = createOrder(products, userEmail);
        channel.ack(data);
        console.log(data);
        channel.sendToQueue(
            "PRODUCT",
            Buffer.from(JSON.stringify({ newOrder }))
        );
    });
});


app.listen(7003, () => {
    console.log(`Prod-Service at 7003`);
});

