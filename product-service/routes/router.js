const express=require("express");
const router=express.Router();
const Product=require("../Product")
const jwt = require("jsonwebtoken");
const isAuthenticated=require("../../isAuthenticated")
//const channel=require("../index")
const amqp=require("amqplib")

async function connect() {
    const amqpServer = "amqp://localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue("PRODUCT");
}
connect();

var order;

router.post("/product/buy",isAuthenticated, async (req, res) => {
    const { ids } = req.body;
    const products = await Product.find({ _id: { $in: ids } });
    channel.sendToQueue("ORDER",
        Buffer.from(
            JSON.stringify({
                products,
                userEmail: req.user.email,
            })
        )
    );

    channel.consume("PRODUCT", (data) => {
         order = JSON.parse(data.content);
    });
    return res.json(order);
});

router.post("/product/create",isAuthenticated, async (req, res) => {
    const { name, description, price } = req.body;
    const newProduct = await Product.create({ name, description, price });
    return res.json(newProduct);
});

module.exports=router;