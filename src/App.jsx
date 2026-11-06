
import { useState, useEffect } from "react";
import axios from "axios";

import StudentForm from "./components/StudentForm";
import IDCard from "./components/IDCard";

import "./App.css";

function App() {

  const [student, setStudent] = useState({
    name: "",
    rollNumber: "",
    course: "",
    year: "",
    email: "",
    phone: "",
    photo: ""
  });

  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Fetch students from MongoDB
  const fetchStudents = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/students"
      );

      setStudents(response.data);

    } catch (error) {
      console.log("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Edit student
  const handleEdit = (item) => {
    setStudent({
      name: item.name,
      rollNumber: item.rollNumber,
      course: item.course,
      year: item.year,
      email: item.email,
      phone: item.phone,
      photo: item.photo || ""
    });

    setEditingId(item._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `http://localhost:5000/api/students/${id}`
      );

      alert("Student deleted successfully!");

      await fetchStudents();

    } catch (error) {
      alert("Error deleting student");
    }
  };

  // Search students
  const filteredStudents = students.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.rollNumber.toLowerCase().includes(search.toLowerCase())
  );

  // Get student photo URL
  const getPhotoUrl = (photo) => {
    if (!photo) return "";

    return photo.startsWith("/uploads/")
      ? `http://localhost:5000${photo}`
      : photo;
  };

  return (
    <div className="container py-5">

      <h1 className="text-center mb-5">
        Digital ID Card Generator
      </h1>

      {/* Form and ID Card Preview */}
      <div className="row g-5">

        <div className="col-md-6">
          <StudentForm
            student={student}
            setStudent={setStudent}
            editingId={editingId}
            setEditingId={setEditingId}
            fetchStudents={fetchStudents}
          />
        </div>

        <div className="col-md-6">

          <h3 className="text-center mb-3">
            ID Card Preview
          </h3>

          <IDCard student={student} />

        </div>

      </div>

      {/* Registered Students */}
      <div className="registered-section mt-5">

        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

          <div>
            <h3 className="registered-title">
              Registered Students
            </h3>

            <p className="text-muted mb-0">
              Total Students: {students.length}
            </p>
          </div>

          <button
            className="btn btn-primary"
            onClick={fetchStudents}
          >
            Refresh List
          </button>

        </div>

        {/* Search */}
        <div className="search-wrapper mb-4">

          <input
            type="text"
            className="form-control"
            placeholder="Search by student name or roll number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {search && (
            <button
              className="btn btn-outline-secondary mt-2"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          )}

        </div>

        {/* Students Table */}
        <div className="table-responsive">

          <table className="table student-table align-middle">

            <thead>
              <tr>
                <th>Photo</th>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Course</th>
                <th>Year</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStudents.length > 0 ? (

                filteredStudents.map((item) => (
                  <tr key={item._id}>

                    <td>
                      {item.photo ? (
                        <img
                          src={getPhotoUrl(item.photo)}
                          alt={item.name}
                          className="student-thumbnail"
                        />
                      ) : (
                        <div className="no-photo">
                          N/A
                        </div>
                      )}
                    </td>

                    <td className="fw-semibold">
                      {item.name}
                    </td>

                    <td>{item.rollNumber}</td>

                    <td>{item.course}</td>

                    <td>
                      <span className="year-badge">
                        {item.year}
                      </span>
                    </td>

                    <td>{item.email}</td>

                    <td>{item.phone}</td>

                    <td>
                      <div className="d-flex gap-2">

                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => handleEdit(item)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>
                ))

              ) : (

                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {search
                      ? "No matching students found"
                      : "No students registered yet"}
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default App;
