const mongoose = require("mongoose");

const connectDB = async () => {
    const databaseUrl = process.env.DATABASE_URL || process.env.MONGO_URI;

    if (!databaseUrl) {
        console.error("Database URL missing. Set DATABASE_URL in .env");
        process.exit(1);
    }

    try {
        await mongoose.connect(databaseUrl);
        console.log("MongoDB Connected Successfully");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
};

module.exports = connectDB;
