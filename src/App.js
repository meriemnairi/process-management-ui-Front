import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar";
import DragArea from "./components/DragArea";
import "./App.css";

function App() {
  const [availablePages, setAvailablePages] = useState([]);
  const [droppedPages, setDroppedPages] = useState([]);

  const handleAddPage = (newPage) => {
    setAvailablePages((prevPages) => [...prevPages, newPage]);
  };

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

  const handleDragStart = (e, page) => {
    e.dataTransfer.setData("page", JSON.stringify(page));
  };

  const handleDrop = (page, x, y) => {
    setDroppedPages((prevPages) => [
      ...prevPages,
      { ...page, x, y }, // Store page with x and y coordinates
    ]);
  };

  // New function to update the dropped page
  const handleUpdatePage = (updatedPage) => {
    setDroppedPages((prevPages) =>
      prevPages.map((page) => (page.id === updatedPage.id ? updatedPage : page))
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
        onUpdatePage={handleUpdatePage} // Pass the update handler
      />
    </div>
  );
}

export default App;
