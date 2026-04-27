import { Navigate } from "react-router-dom";

function RotaProtegida({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  
  if (!usuario) {
    return <Navigate to="/" />;
  } 

  return children;
}

export default RotaProtegida;