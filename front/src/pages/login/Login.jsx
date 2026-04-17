import React from "react";

import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function Login() {
  return (
    <>
      <div className="h-full w-full flex-row justify-start  content-center ">
        <div className="bg-white flex-col content-center justify-items-center h-[50vh] w-[25vw] rounded-[25px] ml-[10vw]">

          <div className=" bg-red-200 flex justify-evenly items-center h-[4vh] w-[15vw] rounded-[15px]">
            <h3>Login</h3> <h3>Cadastra-se</h3>
          </div>
          <div>
            <h1>Bem vindo</h1>
            <h5>Por favor faça seu login!</h5>
          </div>
          <Input
            placeholder={"Digite seu Email"}
            tipo={"text"}
            nome={"Email"}
          />

          <br />

          <Input
            placeholder={"Digite sua Senha!"}
            tipo={"password"}
            nome={"Senha"}
          />
          <br />
          <Entrar/>


          <a href="#">Esqueci minha senha!</a>

       



        </div>
      </div>
    </>
  );
}
