
import { useState } from "react";
import axios from "axios";

function StudentForm({
  student,
  setStudent,
  editingId,
  setEditingId,
  fetchStudents
}) {
  const [photoFile, setPhotoFile] = useState(null);
  const [preview, setPreview] = useState("");

  // Handle normal input changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setStudent({
      ...student,
      [name]: value
    });
  };

  // Handle photo selection
  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Photo size must be less than 2 MB");
      event.target.value = "";
      return;
    }
    const imagePreview = URL.createObjectURL(file);
    setPhotoFile(file);
    setPreview(imagePreview);

    setStudent({
      ...student,
      photo: imagePreview
 });

    
  };

  // Clear form
  const clearForm = () => {
    setStudent({
      name: "",
      rollNumber: "",
      course: "",
      year: "",
      email: "",
      phone: "",
      photo: ""
    });

    setPhotoFile(null);
    setPreview("");
    setEditingId(null);
  };

  // Save or Update Student
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!student.name.trim()) {
      alert("Please enter student name");
      return;
    }

    if (!student.rollNumber.trim()) {
      alert("Please enter roll number");
      return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(student.email)) {
      alert("Please enter a valid email address");
      return;
    }

    // Phone validation
    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(student.phone)) {
      alert("Phone number must contain exactly 10 digits");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("name", student.name);
      formData.append("rollNumber", student.rollNumber);
      formData.append("course", student.course);
      formData.append("year", student.year);
      formData.append("email", student.email);
      formData.append("phone", student.phone);

      if (photoFile) {
        formData.append("photo", photoFile);
      }

      let response;

      if (editingId) {
        // Update existing student
        response = await axios.put(
          `http://localhost:5000/api/students/${editingId}`,
          formData
        );
      } else {
        // Register new student
        response = await axios.post(
          "http://localhost:5000/api/students",
          formData
        );
      }

      alert(response.data.message);

      clearForm();
      await fetchStudents();

    } catch (error) {
      console.log("STUDENT ERROR:", error);

      alert(
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Something went wrong"
      );
    }
  };

  // Cancel editing
  const handleCancel = () => {
    clearForm();
  };

  return (
    <div className="card shadow p-4">

      <h3 className="mb-4">
        {editingId
          ? "Update Student Details"
          : "Enter Student Details"}
      </h3>

      <form onSubmit={handleSubmit}>

        {/* Full Name */}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={student.name}
            onChange={handleChange}
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Roll Number */}
        <div className="mb-3">
          <label className="form-label">Roll Number</label>
          <input
            type="text"
            className="form-control"
            name="rollNumber"
            value={student.rollNumber}
            onChange={handleChange}
            placeholder="Enter roll number"
            required
          />
        </div>

        {/* Course */}
        <div className="mb-3">
          <label className="form-label">Course</label>
          <input
            type="text"
            className="form-control"
            name="course"
            value={student.course}
            onChange={handleChange}
            placeholder="Example: B.Tech CSE"
            required
          />
        </div>

        {/* Year */}
        <div className="mb-3">
          <label className="form-label">Year</label>
          <select
            className="form-select"
            name="year"
            value={student.year}
            onChange={handleChange}
            required
          >
            <option value="">Select Year</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={student.email}
            onChange={handleChange}
            placeholder="Enter email"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="mb-3">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={student.phone}
            onChange={handleChange}
            placeholder="Enter 10-digit phone number"
            pattern="[0-9]{10}"
            maxLength="10"
            required
          />
        </div>

        {/* Photo Upload */}
        <div className="mb-3">
          <label className="form-label">Upload Student Photo</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handlePhotoChange}
          />
          <small className="text-muted">
            Select an image (maximum 2 MB)
          </small>
        </div>

        {/* Photo Preview */}
        {(preview || student.photo) && (
          <div className="mb-3">
            <p className="mb-2">Photo Preview:</p>
            <img
              src={
                preview ||
                (student.photo.startsWith("/uploads/")
                  ? `http://localhost:5000${student.photo}`
                  : student.photo)
              }
              alt="Student Preview"
              width="120"
              height="120"
              style={{
                objectFit: "cover",
                borderRadius: "8px"
              }}
            />
          </div>
        )}

        {/* Save or Update Button */}
        <button
          type="submit"
          className="btn btn-primary w-100"
        >
          {editingId ? "Update Student" : "Save Student"}
        </button>

        {/* Cancel Button */}
        {editingId && (
          <button
            type="button"
            className="btn btn-secondary w-100 mt-2"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}

      </form>
    </div>
  );
}

export default StudentForm;
