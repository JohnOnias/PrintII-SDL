import React from 'react'
import Entrar from "../Button/Entrar";
import Inicio from "../../assets/imgs/inicio.png";
import Imoveis from "../../assets/imgs/imoveis.png";
import Perfil from "../../assets/imgs/perfil.png";
import Logout from "../../assets/imgs/logout.png";
import UserPerfil from "../../assets/imgs/UserPerfil.png";


const UserDetails = ({ usuario }) => {
   let nome = usuario?.nome || "";

   let resultado = nome.charAt(0).toUpperCase() + nome.slice(1);

  return (

    <div className="flex items-center">
   
        <img src={UserPerfil} alt="img de perfil"  className='h-[100px] w-[100px]'/>

     <div className='flex-col '>
       <p>Olá, {resultado} usuario nome.</p>
      <p>
        <strong>{usuario?.tipo} Usuario tipo</strong>
      </p>
     </div>

    </div>
  );
};

  const usuario = JSON.parse(localStorage.getItem("usuario"));

export default function Navbar() {
  return (

    <div className='h-[80vh] m-auto bg-amber-700 '>
            <div>
             <UserDetails usuario={usuario} />
            </div>
        <ul className='flex flex-col justify-around gap-x-15 gap-y-10 '>
           <li className='flex items-center '><img src={Inicio} alt="home"/>Inicio</li>
            <li className="flex items-center"> <img src={Imoveis} alt="imoveis" />Meus Imoveis</li>
             <li className="flex items-center"> <img src={Perfil} alt="perfil" />Perfil</li>
               <li className="flex items-center"> <img src={Logout} alt="logout " />Sair</li>
          
          
          
        </ul>

    </div>
  )
}
