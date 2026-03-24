const mongoose = require("mongoose");




const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required:[true,"Title is required!"],
        trim:true,
        minlength:[3,"Title must be at least 3 charactors long"]
       
    },
    completed: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Date,
        default: null
    },
    reminderAt: {
        type: Date,
        default: null
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "medium"
    },
    category: {
        type: String,
        trim: true,
        default: "General"
    }
}, { timestamps: true });






module.exports = mongoose.model("Task", taskSchema);
