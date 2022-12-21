const mongoose=require("mongoose")
mongoose.connect(
    "mongodb://localhost:27017/auth-service",
    () => {
        console.log(`Auth-Service DB Connected`);
    }
);