import React, { useState } from "react";
import AddPageModal from "./AddPageModal";
import * as FaIcons from "react-icons/fa"; // Import all FontAwesome icons
import "./Sidebar.css";

function Sidebar({ availablePages, onDragStart, onAddPage }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddPage = (pageData) => {
    onAddPage(pageData);
  };

  return (
    <div className="sidebar">
      <h3>Tools</h3>
      <button onClick={() => setIsModalOpen(true)}>Add Page</button>
      <ul className="pages-list">
        {availablePages.length > 0 ? (
          availablePages.map((page, index) => {
            
            const IconComponent = FaIcons[page.icon]; 

            return (
              <li
                key={index}
                className="page-item"
                draggable
                onDragStart={(e) => onDragStart(e, page)}
              >
                <div
                  className={`form-container ${page.form.toLowerCase()}`}
                  style={{ backgroundColor: page.color }}
                >
                  {IconComponent ? (
                    <IconComponent className="icon" />
                  ) : (
                    <span>No icon</span> 
                  )}
                </div>
                <span className="page-title">{page.title}</span>
              </li>
            );
          })
        ) : (
          <li>No pages available</li>
        )}
      </ul>
      {isModalOpen && (
        <AddPageModal
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddPage}
        />
      )}
    </div>
  );
}

export default Sidebar;
