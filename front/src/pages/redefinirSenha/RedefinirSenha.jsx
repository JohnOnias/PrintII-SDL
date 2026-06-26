import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmPasswordReset } from "../../services/authService";
import bg from "../../assets/imgs/bg.png";
import Input from "../../components/Input/Input.jsx";
import Entrar from "../../components/Button/Entrar.jsx";

export default function RedefinirSenha() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uid, setUid] = useState("");
  const [token, setToken] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    setUid(query.get("uid") || "");
    setToken(query.get("token") || "");
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!uid || !token) {
      setError("Link de redefinição inválido ou incompleto.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    setLoading(true);
    try {
      const data = await confirmPasswordReset(uid, token, newPassword);
      setMessage(data.message || "Senha alterada com sucesso!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Erro ao redefinir senha:", err);
      setError(err.message || "Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="flex flex-row justify-start items-center h-screen w-screen bg-cover bg-center bg-no-repeat font-[Poppins]"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="bg-white flex flex-col content-center justify-center items-center  h-[450px] w-[300px] sm:h-[450px] sm:w-[350px]  rounded-[20px] sm:rounded-[25px] sm:ml-[200px] m-auto shadow-lg px-8">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl">Nova Senha</h1>
          <h5 className="font-regular text-gray-600">Digite sua nova senha abaixo</h5>
        </div>

        <form onSubmit={handleSubmit} className="w-full max-w-[300px]">
          <Input
            placeholder={"Nova senha"}
            tipo={"password"}
            nome={"Nova Senha"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <div className="mt-4">
            <Input
              placeholder={"Confirme a senha"}
              tipo={"password"}
              nome={"Confirmar Senha"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="mt-6">
            <Entrar type="submit" disabled={loading} text={loading ? "Salvando..." : "Salvar Senha"} />
          </div>

          {message && (
            <p className="flex justify-center font-[Poppins] text-green-600 text-center text-sm mt-4">
              {message} Redirecionando...
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
