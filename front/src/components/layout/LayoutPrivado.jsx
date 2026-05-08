import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function LayoutPrivado() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar moderna */}
      <Sidebar />

      {/* Conteúdo dinâmico das páginas */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Outlet />
      </div>

    </div>
  );
}

export default LayoutPrivado;