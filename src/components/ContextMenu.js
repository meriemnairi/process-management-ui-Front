// ContextMenu.js
import React from "react";
import "./ContextMenu.css"; 

const ContextMenu = ({ x, y, onVisit, onUpdate }) => {
  return (
    <div className="context-menu" style={{ top: y, left: x }}>
      <ul>
        <li onClick={onVisit}>Visit Page</li>
        <li onClick={onUpdate}>Update Page</li>
      </ul>
    </div>
  );
};

export default ContextMenu;
