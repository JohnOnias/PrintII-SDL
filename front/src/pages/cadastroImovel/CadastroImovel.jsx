import React, { useState, useRef } from "react";

const initialForm = {
  categoria: "",
  tipo: "",
  endereco: "",
  referencia: "",
  cep: "",
  estado: "",
  cidade: "",
  descricao: "",
};

export default function CadastroImovel() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      return isValidType && isValidSize;
    });

    if (validFiles.length !== selectedFiles.length) {
      alert('Apenas imagens e vídeos são permitidos (máx. 10MB cada)');
    }

    setFiles(prev => [...prev, ...validFiles]);
    event.target.value = ''; // Reset input
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = "Campo obrigatório";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setForm(initialForm);
    setFiles([]);
    setErrors({});
    setServerError("");
    setSuccess("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validateForm()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });
      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("http://localhost:8000/imoveis/register", {
        method: "POST",
        body: formData,
      });

      let data = {};
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        data = await response.json();
      }

      if (!response.ok) {
        throw new Error(data.detail || data.message || response.statusText || "Erro ao cadastrar imóvel");
      }

      setSuccess("Imóvel cadastrado com sucesso!");
      clearForm();
    } catch (error) {
      setServerError(error.message || "Erro ao enviar cadastro");
      console.error("Erro no cadastro de imóvel", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-[10px] border px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:border-black ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-2 sm:px-4 sm:py-3">
      <div className="mx-auto max-w-lg sm:max-w-xl md:max-w-2xl">
        <div className="rounded-xl bg-white p-3 shadow-xl sm:p-4 md:p-5">
          <div className="mb-3 text-center sm:mb-4 md:mb-5">
            <h1 className="text-lg font-bold text-slate-900 sm:text-xl">Cadastro de Imóvel</h1>
            <div className="mx-auto mt-1 h-[1px] w-12 bg-slate-200 sm:w-16"></div>
          </div>

          {success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </div>
          )}
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-2 sm:space-y-3">
            <div className="grid gap-2 sm:gap-3 sm:grid-cols-2">
              <div className="space-y-1.5 sm:space-y-2">
                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Categoria</label>
                  <select
                    value={form.categoria}
                    onChange={(e) => handleChange("categoria", e.target.value)}
                    className={inputClass("categoria")}
                  >
                    <option value="">Selecione</option>
                    <option value="Residencial">Residencial</option>
                    <option value="Comercial">Comercial</option>
                  </select>
                  {errors.categoria && <p className="mt-0.5 text-xs text-red-500">{errors.categoria}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Endereço</label>
                  <input
                    type="text"
                    value={form.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    placeholder="Rua Castro, Número 102"
                    className={inputClass("endereco")}
                  />
                  {errors.endereco && <p className="mt-0.5 text-xs text-red-500">{errors.endereco}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">CEP</label>
                  <input
                    type="text"
                    value={form.cep}
                    onChange={(e) => handleChange("cep", e.target.value)}
                    placeholder="63-400-000"
                    className={inputClass("cep")}
                  />
                  {errors.cep && <p className="mt-0.5 text-xs text-red-500">{errors.cep}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Cidade</label>
                  <input
                    type="text"
                    value={form.cidade}
                    onChange={(e) => handleChange("cidade", e.target.value)}
                    placeholder="Fortaleza"
                    className={inputClass("cidade")}
                  />
                  {errors.cidade && <p className="mt-0.5 text-xs text-red-500">{errors.cidade}</p>}
                </div>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Tipo de Imóvel</label>
                  <select
                    value={form.tipo}
                    onChange={(e) => handleChange("tipo", e.target.value)}
                    className={inputClass("tipo")}
                  >
                    <option value="">Selecione</option>
                    <option value="Apartamento">Apartamento</option>
                    <option value="Casa">Casa</option>
                    <option value="Terreno">Terreno</option>
                  </select>
                  {errors.tipo && <p className="mt-0.5 text-xs text-red-500">{errors.tipo}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Referência</label>
                  <input
                    type="text"
                    value={form.referencia}
                    onChange={(e) => handleChange("referencia", e.target.value)}
                    placeholder="Próximo ao teatro Dragão do Mar"
                    className={inputClass("referencia")}
                  />
                  {errors.referencia && <p className="mt-0.5 text-xs text-red-500">{errors.referencia}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Estado</label>
                  <input
                    type="text"
                    value={form.estado}
                    onChange={(e) => handleChange("estado", e.target.value)}
                    placeholder="Ceará"
                    className={inputClass("estado")}
                  />
                  {errors.estado && <p className="mt-0.5 text-xs text-red-500">{errors.estado}</p>}
                </div>

                <div>
                  <label className="mb-0.5 block text-xs font-semibold text-slate-700 sm:text-sm">Descrição</label>
                  <textarea
                    value={form.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    rows={2}
                    placeholder="Ao todo existem 6 cômodos..."
                    className={inputClass("descricao")}
                  />
                  {errors.descricao && <p className="mt-0.5 text-xs text-red-500">{errors.descricao}</p>}
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-slate-50 p-2 sm:p-3">
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-2 py-1.5 sm:px-3 sm:py-2">
                <div>
                  <p className="text-xs font-semibold text-slate-900 sm:text-sm">Adicionar fotos ou vídeos</p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-cyan-500 px-2 py-0.5 text-xs font-semibold text-white hover:bg-cyan-600 sm:px-3 sm:py-1"
                >
                  + Adicionar
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
              <div className="mt-1.5 space-y-1 text-xs text-slate-600 sm:mt-2 sm:space-y-1.5 sm:text-sm">
                {files.length === 0 ? (
                  <div className="rounded-xl border border-slate-200 bg-white px-2 py-2 text-center text-gray-400 sm:px-3 sm:py-3">
                    Nenhum arquivo selecionado
                  </div>
                ) : (
                  files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-2 py-1 sm:px-3 sm:py-1.5">
                      <span className="truncate pr-2">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3 sm:pt-3">
              <button
                type="button"
                onClick={clearForm}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 sm:w-auto sm:px-4 sm:py-2"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400 sm:w-auto sm:px-4 sm:py-2"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
