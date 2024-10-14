import React, { useState } from "react";
import "./AddPageModal.css";

function AddPageModal({ onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const [form, setForm] = useState("");
  const [slug, setSlug] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({}); // Individual field errors

  const forms = ["Square", "Circle"];
  const availableIcons = [
    { name: "FaEnvelope", label: "Envelope Icon" },
    { name: "FaCalendar", label: "Calendar Icon" },
    { name: "FaCamera", label: "Camera Icon" },
    { name: "FaBell", label: "Bell Icon" },
    { name: "FaCar", label: "Car Icon" },
    { name: "FaBook", label: "Book Icon" },
  ];

  // Form validation logic
  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!title) {
      newErrors.title = "Title is required.";
      isValid = false;
    }
    if (!icon) {
      newErrors.icon = "Icon is required.";
      isValid = false;
    }
    if (!color) {
      newErrors.color = "Color is required.";
      isValid = false;
    }
    if (!slug) {
      newErrors.slug = "Link is required.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; 
    }

    try {
      const response = await fetch("http://localhost:5000/api/pages/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, icon, color, form, link: slug }),
      });

      if (!response.ok) {
        if (response.status === 409) {
          setErrors({ slug: "This link is already used!" });
        } else {
          throw new Error("An error occurred while saving the page.");
        }
      } else {
        const result = await response.json();
        onSave(result.page);
        onClose();
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Add New Page</h3>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={handleSubmit} noValidate>
          {" "}
          {/* Disable browser validation */}
          <div>
            <label>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>
          <div>
            <label>Icon</label>
            <select value={icon} onChange={(e) => setIcon(e.target.value)}>
              <option value="">Select an icon</option>
              {availableIcons.map((iconObj) => (
                <option key={iconObj.name} value={iconObj.name}>
                  {iconObj.label}
                </option>
              ))}
            </select>
            {errors.icon && <p className="error-text">{errors.icon}</p>}
          </div>
          <div>
            <label>Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              style={{
                backgroundColor: color,
                color: "#fff",
                borderColor: color,
                borderWidth: "2px",
                borderStyle: "solid",
                width: "400px",
                height: "30px",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            />
            {errors.color && <p className="error-text">{errors.color}</p>}
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
            <label>Link</label>
            <input
              type="url"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            {errors.slug && <p className="error-text">{errors.slug}</p>}
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
