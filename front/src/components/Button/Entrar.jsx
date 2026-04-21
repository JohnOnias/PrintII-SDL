import React from 'react'

export default function Entrar({ onClick}) {

  return (


    <button onClick={onClick} type="submit" className='bg-print2 flex h-[4.9vh] w-[15vw] justify-center justify-items-center items-center rounded-lg font-[Poppins] font-bold text-base hover:bg-blue-600 text-white hover:cursor-pointer'>
      Entrar
    </button>

  )
}
