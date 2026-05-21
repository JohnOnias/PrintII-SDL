import React from 'react'
import Success from "../../assets/imgs/success.png";
import Faill from "../../assets/imgs/faill.png";

export default function ErrosModal({isOpen, onClose, titulo, tipo}) {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">


            <div className="relative mx-4 w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
            <div className='bg-white h-[100px] w-[300px] flex flex-col justify-center'>
            <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            />
                <div>
                    <h4>{titulo}</h4>
                </div>

                {tipo ? 
                <img src={Success} alt="" />
                : <img  className="h-[50px] w-[50px]"  src={Faill} alt="" />
                }
            </div>
        
            </div>

        </div>
    )
}
