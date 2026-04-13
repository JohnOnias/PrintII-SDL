import React from 'react'
import Entrar from '../Button/Entrar';
import Signin from '../Button/Signin';
export default function Footer() {
  return (
    <div>
        Footer


        <Entrar/>
        <Signin/>
        
        <ul className='flex flex-row justify-around gap-x-15 gap-y-10'>
 
            <li>Fale com nosco</li>
            <li>Termos de serviço</li>
        </ul>



    </div>
  )
}
