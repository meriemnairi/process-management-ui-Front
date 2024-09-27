import React, { useState, useEffect } from "react";
// import * as FaIcons from "react-icons/fa"; // Importing FontAwesome icons
import "./AddPageModal.css"; // Reuse styles from AddPageModal

function UpdatePageModal({ existingPage, onClose, onUpdate }) {
  const [title, setTitle] = useState(existingPage.title || "");
  const [icon, setIcon] = useState(existingPage.icon || "");
  const [color, setColor] = useState(existingPage.color || "");
  const [form, setForm] = useState(existingPage.form || "");
  const [slug] = useState(existingPage.link || ""); // Disable this field
  const [errorMessage, setErrorMessage] = useState("");

  const forms = ["Square", "Circle"];
  const availableIcons = [
    { name: "FaEnvelope", label: "Envelope Icon" },
    { name: "FaCalendar", label: "Calendar Icon" },
    { name: "FaCamera", label: "Camera Icon" },
    { name: "FaBell", label: "Bell Icon" },
    { name: "FaCar", label: "Car Icon" },
    { name: "FaBook", label: "Book Icon" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/pages/update/${existingPage._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, icon, color, form, link: slug }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update the page");
        }

        const result = await response.json();
        console.log(result.message); // Handle success message (e.g., show a notification)
        onUpdate(result.page); // Update the parent component with the updated page
        onClose(); // Close modal after saving
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message); // Set error message to display
      }
    }
  };

  // Populate fields with existingPage data when it changes
  useEffect(() => {
    setTitle(existingPage?.title || "");
    setIcon(existingPage.icon || "");
    setColor(existingPage.color || "");
    setForm(existingPage.form || "");
  }, [existingPage]);

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Update Page</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}{" "}
        {/* Display error message */}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label>Icon</label>
            <select
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              required
            >
              <option value="">Select an icon</option>
              {availableIcons.map((iconObj) => (
                <option key={iconObj.name} value={iconObj.name}>
                  {iconObj.label} {/* Option Label */}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <div>
            <label>Form</label>
            <select value={form} onChange={(e) => setForm(e.target.value)}>
              <option value="">Select a form</option>
              {forms.map((formShape) => (
                <option key={formShape} value={formShape}>
                  {formShape}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Link (slug)</label>
            <input
              type="url"
              value={slug}
              disabled // Disable this field
              readOnly // Optional: Makes it clear that it's read-only
            />
          </div>

          <button type="submit">Update Page</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePageModal;
