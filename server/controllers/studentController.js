const Student = require("../models/Student");

// Create Student
const createStudent = async (req, res) => {
    try {
        const {
            name,
            rollNumber,
            course,
            year,
            email,
            phone
        } = req.body;

        const photo = req.file
            ? `/uploads/${req.file.filename}`
            : "";

        if (!name || !rollNumber || !course || !year || !email || !phone) {
            return res.status(400).json({
                message: "Please fill all required fields"
            });
        }

        const student = await Student.create({
            name,
            rollNumber,
            course,
            year,
            email,
            phone,
            photo
        });

        res.status(201).json({
            message: "Student registered successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Error creating student",
            error: error.message
        });
    }
};

// Get All Students
const getStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching students",
            error: error.message
        });
    }
};

// Get Student By ID
const getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json(student);

    } catch (error) {
        res.status(500).json({
            message: "Error fetching student",
            error: error.message
        });
    }
};

// Update Student
const updateStudent = async (req, res) => {
    try {
        const updatedData = {
            ...req.body
        };

        if (req.file) {
            updatedData.photo = `/uploads/${req.file.filename}`;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updatedData,
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student updated successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating student",
            error: error.message
        });
    }
};

// Delete Student
const deleteStudent = async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.status(200).json({
            message: "Student deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error deleting student",
            error: error.message
        });
    }
};

module.exports = {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
};