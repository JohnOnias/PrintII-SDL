import React from 'react'
import Entrar from "../Button/Entrar";


export default function Navbar() {
  return (

    <div className='flex bg-red-300 w-screen h-15 justify-center justify-items-center items-center'>

        <ul className='flex flex-row justify-around gap-x-15 gap-y-10'>
            <li>Home</li>
            <li>Alugar</li>
            <li>Anunciar</li>    
          
        </ul>

    </div>
  )
}
