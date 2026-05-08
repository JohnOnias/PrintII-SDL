import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";

function LayoutPrivado() {
  return (
    <div className="flex h-screen w-screen bg-gray-100 overflow-hidden">
      
      {/* Sidebar moderna */}
      <Sidebar />

      {/* Conteúdo dinâmico das páginas */}
      <div className="w-[80vw] min-w-[80vw] flex flex-col min-h-screen overflow-hidden bg-white">
        <Outlet />
      </div>

    </div>
  );
}

export default LayoutPrivado;