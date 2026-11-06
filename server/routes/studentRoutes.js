
const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const {
    createStudent,
    getStudents,
    getStudentById,
    updateStudent,
    deleteStudent
} = require("../controllers/studentController");

// Student routes
router.post("/", upload.single("photo"), createStudent);

router.get("/", getStudents);

router.get("/:id", getStudentById);

router.put("/:id", upload.single("photo"), updateStudent);

router.delete("/:id", deleteStudent);

module.exports = router;
