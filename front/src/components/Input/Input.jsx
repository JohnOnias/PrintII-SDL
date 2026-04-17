import React from 'react'

export default function Input({nome, placeholder, tipo}) {
    
  return (
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{nome}</label>
                    <input
                      type={tipo}
                      placeholder={placeholder}
                      className=" w-[15vw] h-[5vh] px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 placeholder-gray-400 outline-none focus:bg-gray-50 focus:border border-gray-300"
                      
                    />
                  </div>
    
  )
}
