import { useState, useEffect } from "react";
import Sidebar from "./layout/Sidebar";
import { ROUTES, DEFAULT_ROUTE } from "./routes/routes";

export default function App() {
  const [activeItem, setActiveItem] = useState(DEFAULT_ROUTE);

  // Catches navigation events fired by Topbar when navigate prop isn't passed
  useEffect(() => {
    const handler = (e) => setActiveItem(e.detail);
    window.addEventListener("nfc:navigate", handler);
    return () => window.removeEventListener("nfc:navigate", handler);
  }, []);

  const renderPage = () => {
    const factory = ROUTES[activeItem] ?? ROUTES[DEFAULT_ROUTE];
    return factory(setActiveItem);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fdf5f5]">
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />
      <div className="flex-1 flex flex-col min-h-0 pl-14 lg:pl-0 overflow-x-hidden">
        {renderPage()}
      </div>
    </div>
  );
}