import React, { useState } from "react";
//import * as FaIcons from "react-icons/fa"; // Importing FontAwesome icons
import "./AddPageModal.css"; // Add styles for modal

function AddPageModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState(""); 
  const [color, setColor] = useState("");
  const [form, setForm] = useState("");
  const [slug, setSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const forms = [
    "Square",
    "Circle",
    
  ];
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
    if (title && slug) {
      try {
        const response = await fetch("http://localhost:5000/api/pages/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title, icon, color, form, link: slug }),
        });

        if (!response.ok) {
          throw new Error("Failed to save the page");
        }

        const result = await response.json();
        console.log(result.message); // Handle success message (e.g., show a notification)
        onSave(result.page); // Update the parent component with the new page
        onClose(); // Close modal after saving
      } catch (error) {
        console.error("Error:", error);
        setErrorMessage(error.message); // Set error message to display
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Page</h3>
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
              {availableIcons.map((iconObj) => {
                //const IconComponent = FaIcons[iconObj.name];
                return (
                  <option key={iconObj.name} value={iconObj.name}>
                    {iconObj.label} {/* Option Label */}
                  </option>
                );
              })}
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
              onChange={(e) => setSlug(e.target.value)}
              required
            />
          </div>

          <button type="submit">Save Page</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddPageModal;
