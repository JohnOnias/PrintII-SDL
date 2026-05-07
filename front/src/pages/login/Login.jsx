import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAuth } from "../../services/authService.js";
import bg from "../../assets/imgs/bg.png";
import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const data = await loginAuth(email, senha);

    // 🔥 salva token
    localStorage.setItem("token", data.token);

    // 🔥 pega usuário já salvo
    const oldUser =
      JSON.parse(localStorage.getItem("user")) || {};

    // 🔥 mantém dados antigos
    const updatedUser = {
      ...oldUser,
      email,
      password: senha,
    };

    // 🔥 salva novamente
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    console.log("USER SALVO:", updatedUser);

    navigate("/dashboard");

  } catch (error) {
    console.error("Erro no login:", error);

    alert("Erro ao fazer login");
  }
};

  return (
    <div
      className="flex flex-row justify-start items-center h-screen w-screen bg-cover bg-center bg-no-repeat font-[Poppins]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white flex-col content-center justify-items-center h-[55vh] w-[20vw] rounded-[25px] ml-[10vw] m-auto">

        <div className="bg-gray-100 flex justify-evenly items-center h-[4vh] w-[15vw] rounded-[7px] mb-[1vh]">

          <h3 className="font-bold">
            Login
          </h3>

          <h3
            className="hover:font-bold hover:text-black cursor-pointer"
            onClick={() => navigate("/cadastro")}
          >
            Cadastra-se
          </h3>

        </div>

        <div>
          <h1 className="font-bold">
            Bem vindo
          </h1>

          <h5>
            Por favor faça seu login!
          </h5>
        </div>

        <form onSubmit={handleLogin}>

          <br />

          <Input
            placeholder={"Usuario@email.com"}
            tipo={"email"}
            nome={"E-mail"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />

          <Input
            placeholder={"Senha"}
            tipo={"password"}
            nome={"Senha"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <br />

          <Entrar type="submit" />

          <br />

        </form>

        <p
          onClick={() => navigate("/resetSenha")}
          className="cursor-pointer"
        >
          Esqueci minha senha!
        </p>

      </div>
    </div>
  );
}