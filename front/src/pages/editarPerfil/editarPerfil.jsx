import React, { useEffect, useState, useRef } from "react";
import { getUser, updateUser } from "../../services/userService";
import UserPerfil from "../../assets/imgs/UserPerfil.png";

export default function EditarPerfil() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    telefone: "",
    locacao: "",
    cpf: "",
    sexo: "",
    profissao: "",
    nascimento: "",
    endereco: "",
    rede_social_1: "",
    rede_social_2: "",
    rede_social_3: "",
  });

  const [user, setUser] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const fileInputRef = useRef(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setUser(userData);
      setForm({
        username: userData.username || "",
        email: userData.email || "",
        telefone: userData.telefone || "",
        locacao: userData.locacao || "",
        cpf: userData.cpf || "",
        sexo: userData.sexo || "",
        profissao: userData.profissao || "",
        nascimento: userData.nascimento || "",
        endereco: userData.endereco || "",
        rede_social_1: userData.rede_social_1 || "",
        rede_social_2: userData.rede_social_2 || "",
        rede_social_3: userData.rede_social_3 || "",
      });
    }
  }, []);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};
    if (!form.username.trim()) errors.username = true;
    if (!form.email.trim()) errors.email = true;
    if (!form.telefone.trim()) errors.telefone = true;

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setShowErrorPopup(true);
      return;
    }

    try {
      let dataToSubmit;

      if (selectedFile) {
        dataToSubmit = new FormData();
        Object.keys(form).forEach(key => {
          dataToSubmit.append(key, form[key]);
        });
        dataToSubmit.append('foto_perfil', selectedFile);
      } else {
        dataToSubmit = form;
      }

      const updatedUser = await updateUser(dataToSubmit);
      setUser(updatedUser);
      setForm({
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        telefone: updatedUser.telefone || "",
        locacao: updatedUser.locacao || "",
        cpf: updatedUser.cpf || "",
        sexo: updatedUser.sexo || "",
        profissao: updatedUser.profissao || "",
        nascimento: updatedUser.nascimento || "",
        endereco: updatedUser.endereco || "",
        rede_social_1: updatedUser.rede_social_1 || "",
        rede_social_2: updatedUser.rede_social_2 || "",
        rede_social_3: updatedUser.rede_social_3 || "",
      });
      setFieldErrors({});
      setShowSuccessPopup(true);
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao atualizar perfil: " + err.message);
    }
  }

  if (!user) return <div className="p-10 text-center">Carregando...</div>;

  const isLocador = user?.tipo_de_usuario === 'locador';
  
  // Resolve avatar URL
  const getAvatarUrl = () => {
    if (previewUrl) return previewUrl;
    if (user.foto_perfil) {
      return user.foto_perfil.startsWith('http') ? user.foto_perfil : `${API_BASE_URL}${user.foto_perfil}`;
    }
    return UserPerfil;
  };

  return (
    <div className="flex flex-col h-full w-full bg-white font-[Poppins]">
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* HEADER */}
        <header className="bg-white px-8 py-6 flex items-center gap-4">
          <h1 className="text-2xl font-light text-slate-800">
            Olá, {user.username}!
          </h1>
        </header>

        {/* CONTEÚDO CENTRAL */}
        <div className="px-12 py-8 max-w-[900px]">
          
          {/* FOTO E MUDAR FOTO */}
          <div className="flex items-center gap-6 mb-12">
            <div className="h-28 w-28 rounded-full border-[6px] border-[#176999] overflow-hidden shadow-sm bg-white">
              <img
                src={getAvatarUrl()}
                alt="avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            <button 
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="bg-[#176999] text-white px-6 py-2 rounded-full text-xs font-bold shadow-sm transition hover:bg-[#12557a]"
            >
              Mudar Foto
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* DADOS DO PERFIL */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Dados do Perfil</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Nome</label>
                  <input
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    className={`w-full mt-1 border rounded-md p-2 text-sm outline-none ${
                      fieldErrors.username ? "border-red-500 bg-red-50" : "border-gray-200 text-gray-600 focus:border-[#176999]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Email</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className={`w-full mt-1 border rounded-md p-2 text-sm outline-none ${
                      fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-200 text-gray-600 focus:border-[#176999]"
                    }`}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Telefone</label>
                  <input
                    name="telefone"
                    value={form.telefone}
                    onChange={handleChange}
                    placeholder="(88) 91234-5678"
                    className={`w-full mt-1 border rounded-md p-2 text-sm outline-none ${
                      fieldErrors.telefone ? "border-red-500 bg-red-50" : "border-gray-200 text-gray-600 focus:border-[#176999]"
                    }`}
                  />
                </div>
              </div>
            </section>

            {/* QUAL TIPO DE LOCAÇÃO PROCURO / DESCRIÇÃO */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-[10px] font-bold text-black uppercase mb-3">
                {isLocador ? "O que espero do locatário?" : "Qual tipo de locação procuro?"}
              </h2>
              <textarea
                name="locacao"
                value={form.locacao}
                onChange={handleChange}
                rows={3}
                className="w-full border border-gray-200 rounded-md p-3 text-sm text-gray-600 outline-none focus:border-[#176999] leading-relaxed"
                placeholder="Descreva o que você busca..."
              />
            </section>

            {/* REDES SOCIAIS (Apenas para Locador) */}
            {isLocador && (
              <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Redes Sociais</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-black uppercase tracking-wider">URL 1 (Instagram)</label>
                    <input
                      name="rede_social_1"
                      value={form.rede_social_1}
                      onChange={handleChange}
                      placeholder="https://instagram.com/seuusuario"
                      className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-black uppercase tracking-wider">URL 2 (WhatsApp)</label>
                    <input
                      name="rede_social_2"
                      value={form.rede_social_2}
                      onChange={handleChange}
                      placeholder="https://wa.me/seunumerotelefone"
                      className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-black uppercase tracking-wider">URL 3 (Outra)</label>
                    <input
                      name="rede_social_3"
                      value={form.rede_social_3}
                      onChange={handleChange}
                      placeholder="https://outraredesocial.com/perfil"
                      className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* SENHA DE ACESSO */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Senha de Acesso</h2>
              <div>
                <label className="text-[10px] font-bold text-black uppercase">Senha</label>
                <div className="mt-1">
                   <button type="button" className="text-xs font-medium text-cyan-600 hover:underline flex items-center gap-1">
                     Alterar Senha ✎
                   </button>
                </div>
              </div>
            </section>

            {/* OUTROS DADOS */}
            <section className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Outros Dados</h2>
              <div className="flex flex-col gap-y-6">
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">CPF</label>
                  <input
                    name="cpf"
                    value={form.cpf}
                    onChange={handleChange}
                    placeholder="000.123.456-78"
                    className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Sexo</label>
                  <select
                    name="sexo"
                    value={form.sexo}
                    onChange={handleChange}
                    className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999] bg-white"
                  >
                    <option value="">Selecione</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Profissão</label>
                  <input
                    name="profissao"
                    value={form.profissao}
                    onChange={handleChange}
                    placeholder="Sua profissão"
                    className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Data de Nascimento</label>
                  <input
                    name="nascimento"
                    value={form.nascimento}
                    onChange={handleChange}
                    placeholder="01/01/1990"
                    className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-black uppercase tracking-wider">Endereço</label>
                  <input
                    name="endereco"
                    value={form.endereco}
                    onChange={handleChange}
                    placeholder="Seu endereço completo"
                    className="w-full mt-1 border border-gray-200 rounded-md p-2 text-sm text-gray-600 outline-none focus:border-[#176999]"
                  />
                </div>
              </div>
            </section>

            {/* BOTÃO SALVAR */}
            <div className="pt-6">
              <button
                type="submit"
                className="bg-[#176999] text-white px-10 py-2 rounded-md text-sm font-bold shadow-md transition hover:bg-[#12557a]"
              >
                Salvar Alterações
              </button>
            </div>

          </form>
        </div>
      </main>

      {showSuccessPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowSuccessPopup(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-800">Alterações salvas!</p>
            <p className="text-sm text-gray-500 mt-1">Seu perfil foi atualizado com sucesso.</p>
          </div>
        </div>
      )}

      {showErrorPopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowErrorPopup(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl px-10 py-8 text-center max-w-sm mx-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-lg font-bold text-gray-800">Campos obrigatórios</p>
            <p className="text-sm text-gray-500 mt-1">Preencha todos os campos destacados em vermelho.</p>
          </div>
        </div>
      )}
    </div>
  );
}
