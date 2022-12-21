const mongoose=require("mongoose")
mongoose.connect(
    "mongodb://localhost:27017/order-service",
    () => {
        console.log(`order-Service DB Connected`);
    }
);