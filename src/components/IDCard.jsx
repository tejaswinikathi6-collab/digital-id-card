
import { useRef } from "react";
import html2pdf from "html2pdf.js";

// Render backend URL
const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

function IDCard({ student }) {
  const cardRef = useRef();

  // Get correct student photo URL
  const photoUrl = student.photo
    ? student.photo.startsWith("/uploads/")
      ? `${API_URL}${student.photo}`
      : student.photo
    : "";

  // Download ID Card as PDF
  const handleDownload = () => {
    const element = cardRef.current;

    const options = {
      margin: 0.5,
      filename: `${student.name || "Student"}_ID_Card.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 3, useCORS: true },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait"
      }
    };

    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="text-center">

      {/* Professional ID Card */}
      <div className="id-card" ref={cardRef}>

        {/* College Header */}
        <div className="college-header">
          <div className="college-logo">
            <span>ABC</span>
          </div>

          <h3>ABC COLLEGE OF ENGINEERING</h3>
          <p>STUDENT IDENTITY CARD</p>
        </div>

        {/* Student Photo */}
        <div className="photo-section">
          {photoUrl ? (
            <img src={photoUrl} alt="Student" />
          ) : (
            <div className="default-photo">
              PHOTO
            </div>
          )}
        </div>

        {/* Student Details */}
        <div className="student-details">
          <h4>{student.name || "Student Name"}</h4>

          <div className="student-info">
            <p>
              <strong>Roll Number:</strong>
              <span>{student.rollNumber || "XXXXXXXX"}</span>
            </p>

            <p>
              <strong>Course:</strong>
              <span>{student.course || "Course"}</span>
            </p>

            <p>
              <strong>Year:</strong>
              <span>{student.year || "Year"}</span>
            </p>

            <p>
              <strong>Email:</strong>
              <span>{student.email || "Email"}</span>
            </p>

            <p>
              <strong>Phone:</strong>
              <span>{student.phone || "Phone"}</span>
            </p>
          </div>
        </div>

        {/* Signature Section */}
        <div className="signature-section">
          <div>
            <span>________________</span>
            <p>Student Signature</p>
          </div>

          <div>
            <span>________________</span>
            <p>Authorized Signature</p>
          </div>
        </div>

        {/* Footer */}
        <div className="card-footer">
          <p>VALID STUDENT ID</p>
          <small>ABC COLLEGE OF ENGINEERING</small>
        </div>

      </div>

      {/* Download Button */}
      <button
        className="btn btn-success mt-3"
        onClick={handleDownload}
      >
        Download ID Card PDF
      </button>

    </div>
  );
}

export default IDCard;
