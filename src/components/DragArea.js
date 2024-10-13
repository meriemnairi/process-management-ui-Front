import React, { useRef, useState } from "react";
import * as FaIcons from "react-icons/fa";
import UpdatePageModal from "./UpdatePageModal";
import ContextMenu from "./ContextMenu"; 
import "./DragArea.css";

function DragArea({ onDrop, pages, onUpdatePage }) {
  const dragAreaRef = useRef(null);
  const [arrows, setArrows] = useState([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPage, setStartPage] = useState(null);
  const [selectedPage, setSelectedPage] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [contextMenu, setContextMenu] = useState(null); 
  //const clickTimeoutRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const page = JSON.parse(e.dataTransfer.getData("page"));
    const dragAreaRect = dragAreaRef.current.getBoundingClientRect();
    const dropX = e.clientX - dragAreaRect.left;
    const dropY = e.clientY - dragAreaRect.top;
    onDrop(page, dropX, dropY);
  };

  const handleMouseDown = (page) => {
    setIsDrawing(true);
    setStartPage(page);
  };

  const handleMouseUp = (e) => {
    if (isDrawing) {
      const dragAreaRect = dragAreaRef.current.getBoundingClientRect();
      const endX = e.clientX - dragAreaRect.left;
      const endY = e.clientY - dragAreaRect.top;

      if (startPage) {
        setArrows((prevArrows) => [
          ...prevArrows,
          {
            start: { x: startPage.x + 50, y: startPage.y + 25 },
            end: { x: endX, y: endY },
          },
        ]);
      }
    }
    setIsDrawing(false);
    setStartPage(null);
  };

  const handleRightClick = (e, page) => {
    e.preventDefault(); 
    setSelectedPage(page); 
    setContextMenu({ x: e.clientX, y: e.clientY }); 
  };

  const handleVisitPage = () => {
    if (selectedPage) {
      window.open(selectedPage.link, "_blank");
      setContextMenu(null); 
    }
  };

  const handleUpdatePage = () => {
    setIsPopupOpen(true);
    setContextMenu(null); 
  };

  const handleUpdatePageModal = (updatedPage) => {
    onUpdatePage(updatedPage);
    setIsPopupOpen(false);
  };

  const renderArrows = () => {
    return arrows.map((arrow, index) => {
      const { start, end } = arrow;
      return (
        <g key={`arrow-${index}`}>
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="black"
            strokeWidth="1"
          />
          <polygon points={getArrowheadPoints(start, end)} fill="black" />
        </g>
      );
    });
  };

  const getArrowheadPoints = (start, end) => {
    const headLength = 20;
    const angle = Math.atan2(end.y - start.y, end.x - start.x);

    const p1 = {
      x: end.x - headLength * Math.cos(angle - Math.PI / 6),
      y: end.y - headLength * Math.sin(angle - Math.PI / 6),
    };
    const p2 = {
      x: end.x - headLength * Math.cos(angle + Math.PI / 6),
      y: end.y - headLength * Math.sin(angle + Math.PI / 6),
    };

    return `${end.x},${end.y} ${p1.x},${p1.y} ${p2.x},${p2.y}`;
  };

  return (
    <div
      ref={dragAreaRef}
      className="drag-area"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      onMouseUp={handleMouseUp}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {renderArrows()}
      </svg>

      {pages.map((page, index) => {
        const IconComponent = FaIcons[page.icon] || null;
        return (
          <div
            key={index}
            className="dropped-page"
            style={{ left: `${page.x}px`, top: `${page.y}px` }}
            onMouseDown={() => handleMouseDown(page)}
            onContextMenu={(e) => handleRightClick(e, page)} 
          >
            <div
              className={`form-container-dd ${page.form.toLowerCase()}`}
              style={{ backgroundColor: page.color }}
            >
              {IconComponent ? (
                <IconComponent className="icon" />
              ) : (
                <span>No icon</span>
              )}
            </div>
            <span className="page-title-dd">
              {page.title} {page.views}
            </span>
          </div>
        );
      })}

      {isPopupOpen && selectedPage && (
        <UpdatePageModal
          existingPage={selectedPage}
          onClose={() => setIsPopupOpen(false)}
          onUpdate={handleUpdatePageModal}
        />
      )}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onVisit={handleVisitPage}
          onUpdate={handleUpdatePage}
        />
      )}
    </div>
  );
}

export default DragArea;
