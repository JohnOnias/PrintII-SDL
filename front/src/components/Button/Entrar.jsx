import React from 'react';

export default function Entrar({ type = "button" }) {
  return (
    <button
      type={type}
      className='bg-print2 flex h-[4.9vh] w-full justify-center items-center rounded-lg font-[Poppins] font-bold text-base hover:bg-blue-600 text-white cursor-pointer'
    >
      Entrar
    </button>
  );
}