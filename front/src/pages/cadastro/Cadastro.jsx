import React from 'react'

export default function Cadastro() {
  return (
    <><div className=' bg-red-200'>
          <h1>LOGO</h1>
      </div>

      <div className=' '>
              <h2>Login</h2>
        </div>

        <div>
            <h2>Cadastre-se</h2>
        </div>

        <div className=' '>
        <h3>Bem-vindo</h3>
        </div>
        
        <div className=' '>
            <p>Por favor, faça seu cadastro.</p>
        </div>
        
        <label className=' '>
        Name: <input name="myInput" />
        </label>
        
        <label>
        Sobrenome: <input name="myInput" />
        </label>

        <label>
        CPF: <input name="myInput" />
        </label>

        <label>
        Data de Nascimento: <input name="myInput" />
        </label>

        <label>
        Sexo: <input name="myInput" />
        </label>
        
        
        </>
    
  )
}
