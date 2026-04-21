import React from 'react'

export default function Input({nome, placeholder, tipo, value, onChange}) {
    
  return (
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">{nome}</label>

                    <input
                      type={tipo}
                      required
                      minLength={6}
                      placeholder={placeholder}
                      value={value}
                      onChange={onChange}
                      className=" w-[15vw] h-[5vh] px-4 py-2.5 bg-gray-100 rounded-lg text-sm text-gray-700 borde-solid border-gray-400 border"
                      
                    />
                  </div>
    
  )
}
