const mongoose=require("mongoose")
mongoose.connect(
    "mongodb://localhost:27017/prod-service",
    () => {
        console.log(`Prod-Service DB Connected`);
    }
);