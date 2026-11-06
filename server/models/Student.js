// Import mongoose
const mongoose = require("mongoose");

// Create Student Schema
const studentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    rollNumber: {
        type: String,
        required: true,
        unique: true
    },

    course: {
        type: String,
        required: true
    },

    year: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    photo: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

// Create Student Model
const Student = mongoose.model("Student", studentSchema);

// Export Student Model
module.exports = Student;