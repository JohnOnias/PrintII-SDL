import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAuth } from "../../services/authService.js";
import bgImg from "../../assets/imgs/bg.png";
import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showErro, setShowErro] = useState(false);
  const [camposVazios, setCamposVazios] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setShowErro(false);
    setCamposVazios(false);

    if (!email.trim() || !senha.trim()) {
      setCamposVazios(true);
      return;
    }

    try {
      // O service já salva 'access', 'refresh' e 'user' no localStorage
      const data = await loginAuth(email, senha);

      console.log("LOGIN SUCESSO:", data);

      navigate("/dashboard");
    } catch (error) {
      console.error("Erro no login:", error);
      setShowErro(true);
    }
  };

  return (
    <div
    className="h-screen w-full overflow-hidden"
    style={{
      backgroundImage: `url(${bgImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
     <div className="relative mx-auto flex min-h-screen w-full  items-center justify-center lg:justify-start px-4 md:px-8 lg:px-16">
      
      <div className="bg-white h-[450px] w-[350px]  flex flex-col content-center justify-center items-center rounded-[25px] lg:ml-[10vw] m-auto shadow-lg">

        <div className="bg-gray-100 flex justify-evenly items-center h-[40px] w-[250px] md:h-[40px] md:w-[300px] rounded-[7px] mb-[5px]">
          <h3 className="font-bold text-black cursor-default">Login</h3>
          <h3
            className="text-gray-500 font-[Poppins] hover:font-bold hover:text-black cursor-pointer"
            onClick={() => navigate("/cadastro")}
          >
            Cadastra-se
          </h3>
        </div>

        <div className="text-center mb-4">
          <h1 className="font-bold text-2xl">Bem vindo</h1>
          <h5 className="font-regular text-gray-600">Por favor faça seu login!</h5>
        </div>

        <form onSubmit={handleLogin} className="w-[250px]">
          <Input
            placeholder={"Usuario@email.com"}
            tipo={"email"}
            nome={"E-mail"}
            value={email}
            onChange={(e) => { setEmail(e.target.value); setCamposVazios(false); setShowErro(false); }}
            erro={camposVazios || showErro}
          />

          <div className="w-[250px]">
            <Input
              placeholder={"Senha"}
              tipo={"password"}
              nome={"Senha"}
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setCamposVazios(false); setShowErro(false); }}
              erro={camposVazios || showErro}
            />
          </div>

          {camposVazios && (
            <span className="flex justify-center font-[Poppins] text-red-600 text-center text-sm mt-2">
              Dados não preenchidos!
            </span>
          )}

          <div className="mt-4">
            <Entrar type="submit" />
          </div>

          {showErro && (
            <span className="flex justify-center font-[Poppins] text-red-600 text-center text-sm mt-2">
              Dados inválidos ou não cadastrados!
            </span>
          )}
        </form>

        <p
          onClick={() => navigate("/esqueci-senha")}
          className="cursor-pointer text-sm text-gray-500 hover:text-black mt-4"
        >
          Esqueci minha senha!
        </p>
      </div>
      </div>
    </div>
  );
}
