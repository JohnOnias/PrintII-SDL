import { Outlet } from "react-router";
import Navbar from "../Navbar/Navbar";

function LayoutPrivado() {
  return (
    <div className="h-screen w-screen flex">
      
      {/* Sidebar */}
      <div className="bg-amber-300 w-1/5 min-w-[200px]">
        <Navbar />
      </div>

      {/* Conteúdo */}
      <div className="bg-red-200 flex-1 overflow-auto">
        <Outlet />
      </div>

    </div>
  );
}

export default LayoutPrivado;