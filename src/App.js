import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import DragArea from "./components/DragArea";
import "./App.css";

function App() {
  const [availablePages, setAvailablePages] = useState([]);
  const [droppedPages, setDroppedPages] = useState([]);

  // Fetch available pages from API on load
  useEffect(() => {
    const fetchPages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/pages");
        if (!response.ok) {
          throw new Error("Failed to fetch pages");
        }
        const pages = await response.json();
        setAvailablePages(pages);
      } catch (error) {
        console.error("Error fetching pages:", error);
      }
    };

    fetchPages();
  }, []);

  // Add new page to available pages list
  const handleAddPage = (newPage) => {
    setAvailablePages((prevPages) => [...prevPages, newPage]);
  };

  // Handle dragging of pages from sidebar
  const handleDragStart = (e, page) => {
    e.dataTransfer.setData("page", JSON.stringify(page));
  };

  // Handle dropping pages into the drag area
  const handleDrop = (page, x, y) => {
    setDroppedPages((prevPages) => [...prevPages, { ...page, x, y }]);
  };

  // Handle updating pages (after incrementing views or editing)
  const handleUpdatePage = (updatedPage) => {
    // Update the dropped pages state
    setDroppedPages((prevPages) =>
      prevPages.map((page) =>
        page._id === updatedPage._id ? { ...page, ...updatedPage } : page
      )
    );

    // Optionally, update the availablePages as well if needed
    setAvailablePages((prevPages) =>
      prevPages.map((page) =>
        page._id === updatedPage._id ? { ...page, ...updatedPage } : page
      )
    );
  };

  return (
    <div className="app">
      <Sidebar
        availablePages={availablePages}
        onDragStart={handleDragStart}
        onAddPage={handleAddPage}
      />
      <DragArea
        onDrop={handleDrop}
        pages={droppedPages}
        onUpdatePage={handleUpdatePage}
      />
    </div>
  );
}

export default App;
