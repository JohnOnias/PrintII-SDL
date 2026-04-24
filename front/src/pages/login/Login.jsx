import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// importo a função de login auth
import { loginAuth } from "../../services/authService.js";

//importo a imagem de fundo
import bg from '../../assets/imgs/bg.png';

//importo components reutilizaveis
import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function Login() {

  // declaro useState
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showErro, setShowErro] = useState(false); 




  const navigate = useNavigate();
  // funcção de login auth
  const handleLogin = async () => {
    setShowErro(false); 

    console.log("teste");
    

    try {
      const data = await loginAuth(email, senha);

      localStorage.setItem("token", data.token);

      navigate("/dashboard");

    } catch (error) {
      
      console.error(error.message);
      setShowErro(true); 

    }

  };


  return (
    <>
      <div className=" flex flex-row  justify-start content-center items-center h-screen w-screen bg-cover bg-center bg-no-repeat font-[Poppins] "
        style={{ backgroundImage: `url(${bg})` }}
      >

        <div className="bg-white flex-col content-center justify-items-center h-[55vh] w-[20vw] rounded-[25px] ml-[10vw] m-auto">
          <div >
            <div className=" bg-gray-100 flex justify-evenly items-center h-[4vh] w-[15vw] rounded-[7px] mb-[1vh]">

              <h3 className="font-bold ">Login</h3>
              <h3 className="text-print2fontcinza font-[Poppins]  hover:font-bold hover:text-black cursor-pointer " onClick={() => navigate("/cadastro")}>Cadastra-se</h3>
            </div>
            <div >
              <h1 className="font-bold">Bem vindo</h1>
              <h5 className="font-regular text ">Por favor faça seu login!</h5>
            </div>
           <form onSubmit={(e) => {
  e.preventDefault();
  handleLogin();
}}>
              <br />
              <Input
                placeholder={"Usuário@email.com"}
                tipo={"email"}
                nome={"E-mail"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
                  {showErro && (
                    <span className="flex justify-center font-[Poppins] text-red-600 text-center">
                      Email ou Senha Invalidos!
                    </span>
                  )}
                          
        
              <br />

              <Input
                placeholder={"Usuario123"}
                tipo={"password"}
                nome={"Senha"}
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
              <br />

              <Entrar  />

              <br />
            </form>

            <p onClick={() => navigate("/resetSenha")} className="hover: cursor-pointer ">Esqueci minha senha!</p>





          </div>
        </div>
      </div>
    </>
  );
}
