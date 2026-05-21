import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestPasswordReset } from "../../services/authService";
import bg from "../../assets/imgs/bg.png";
import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function EsqueciSenha() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const data = await requestPasswordReset(email);
      setMessage(data.message || "Link de recuperação enviado!");
    } catch (err) {
      console.error("Erro no esqueci senha:", err);
      setError(err.message || "Erro ao enviar o link. Verifique o e-mail digitado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-row justify-start items-center h-screen w-screen bg-cover bg-center bg-no-repeat font-[Poppins]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white flex flex-col content-center justify-center items-center h-[55vh] w-[20vw] rounded-[25px] ml-[10vw] m-auto shadow-lg px-8">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl">Recuperar Senha</h1>
          <h5 className="font-regular text-gray-600">Enviaremos um link para o seu e-mail</h5>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[15vw]">
          <Input
            placeholder={"Usuario@email.com"}
            tipo={"email"}
            nome={"E-mail"}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="mt-6">
            <Entrar type="submit" disabled={loading} text={loading ? "Enviando..." : "Enviar Link"} />
          </div>

          {message && (
            <p className="flex justify-center font-[Poppins] text-green-600 text-center text-sm mt-4">
              {message}
            </p>
          )}
          {error && (
            <p className="flex justify-center font-[Poppins] text-red-600 text-center text-sm mt-4">
              {error}
            </p>
          )}
        </form>

        <p
          onClick={() => navigate("/login")}
          className="cursor-pointer text-sm text-gray-500 hover:text-black mt-6"
        >
          Voltar para o login
        </p>
      </div>
    </div>
  );
}
