import React, { useState, useRef, useEffect } from "react";
import { createImovel, updateImovel as updateImovelService } from "../../services/imovelService";
import { fetchAddressByCEP } from "../../services/cepService";

const initialForm = {
  categoria: "",
  tipo: "",
  endereco: "",
  referencia: "",
  cep: "",
  estado: "",
  cidade: "",
  descricao: "",
  valor: "",
};

export default function CadastroImovel({ isOpen, onClose, imovelData = null }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [files, setFiles] = useState([]);
  const [removedMediaIds, setRemovedMediaIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [serverError, setServerError] = useState("");
  const fileInputRef = useRef(null);
  
  const isEditing = !!imovelData;
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  useEffect(() => {
    if (imovelData && isOpen) {
      console.log("📝 Preenchendo formulário com:", imovelData);
      
      // Tentativa de Parsing do Endereço
      // O backend concatena assim: `${form.endereco}, ${form.cidade} - ${form.estado}, CEP: ${form.cep} (${form.referencia})`
      
      // Regex aprimorada para capturar os grupos corretamente, lidando com vírgulas no endereço
      // O padrão busca: [Rua/Número], [Cidade] - [Estado], CEP: [CEP] ([Referência])
      const regex = /^(.*),\s*(.*?)\s*-\s*(.*?),\s*CEP:\s*(.*?)\s*\((.*?)\)$/;
      const match = imovelData.endereco ? imovelData.endereco.match(regex) : null;

      if (match) {
        console.log("✅ Endereço parseado com sucesso");
        setForm({
          categoria: imovelData.categoria || "",
          tipo: imovelData.tipo || "",
          endereco: (match[1] || "").trim(),
          cidade: (match[2] || "").trim(),
          estado: (match[3] || "").trim(),
          cep: (match[4] || "").trim(),
          referencia: (match[5] || "").trim(),
          descricao: imovelData.descricao || "",
          valor: imovelData.valor || "",
        });
      } else {
        console.warn("⚠️ Regex falhou, tentando split manual para endereço");
        // Fallback manual se o regex falhar (formato não padrão)
        const parts = imovelData.endereco ? imovelData.endereco.split(',') : [];
        const lastPart = parts.length > 1 ? parts.pop() : ""; // Tenta pegar a parte final com CEP/Ref
        const cityStatePart = parts.length > 1 ? parts.pop() : ""; // Tenta pegar Cidade - Estado
        
        setForm({
          categoria: imovelData.categoria || "",
          tipo: imovelData.tipo || "",
          endereco: parts.join(',').trim() || imovelData.endereco || "",
          referencia: lastPart.match(/\((.*?)\)/)?.[1] || "",
          cep: lastPart.match(/CEP:\s*(.*?)\s/)?.[1] || "",
          estado: cityStatePart.split('-')[1]?.trim() || "",
          cidade: cityStatePart.split('-')[0]?.trim() || "",
          descricao: imovelData.descricao || "",
          valor: imovelData.valor || "",
        });
      }
      setFiles([]); 
      setRemovedMediaIds([]);
    } else if (!isEditing && isOpen) {
      setForm(initialForm);
      setFiles([]);
      setRemovedMediaIds([]);
    }
    
    if (isOpen) {
      setErrors({});
      setServerError("");
      setSuccess("");
    }
  }, [imovelData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleCEPChange = async (value) => {
    handleChange("cep", value);
    
    const cleanedCEP = value.replace(/\D/g, "");
    if (cleanedCEP.length === 8) {
      try {
        const addressData = await fetchAddressByCEP(cleanedCEP);
        setForm((prev) => ({
          ...prev,
          endereco: addressData.logradouro,
          cidade: addressData.cidade,
          estado: addressData.estado,
          referencia: prev.referencia || addressData.bairro,
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
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
    event.target.value = ''; 
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const markMediaForRemoval = (id) => {
    setRemovedMediaIds(prev => [...prev, id]);
  };

  const unmarkMediaForRemoval = (id) => {
    setRemovedMediaIds(prev => prev.filter(midiaId => midiaId !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.entries(form).forEach(([key, value]) => {
      if (value === undefined || value === null || (typeof value === 'string' && !value.trim())) {
        newErrors[key] = "Campo obrigatório";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearForm = () => {
    setForm(initialForm);
    setFiles([]);
    setRemovedMediaIds([]);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setServerError("");
    setSuccess("");
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append("categoria", form.categoria);
      formData.append("tipo", form.tipo);
      formData.append("descricao", form.descricao);
      formData.append("valor", form.valor);
      
      const fullEndereco = `${form.endereco}, ${form.cidade} - ${form.estado}, CEP: ${form.cep} (${form.referencia})`;
      formData.append("endereco", fullEndereco);

      files.forEach((file) => {
        formData.append("midias_upload", file);
      });

      if (isEditing) {
        removedMediaIds.forEach(id => {
          formData.append("midias_remover", id);
        });

        await updateImovelService(imovelData.id, formData);
        setSuccess("Imóvel atualizado com sucesso!");
      } else {
        await createImovel(formData);
        setSuccess("Imóvel cadastrado com sucesso!");
      }

      setTimeout(() => {
        clearForm();
        if (onClose) onClose();
        window.location.reload();
      }, 1500);
    } catch (error) {
      setServerError(error.message || "Erro ao processar solicitação");
      console.error("Erro no processamento de imóvel", error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full rounded-[10px] border px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:border-black ${
      errors[field] ? "border-red-500" : "border-gray-300"
    }`;

  return (
    <div 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 font-[Poppins]"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 bg-slate-50/50">
          <h2 className="text-xl font-bold text-slate-900">
            {isEditing ? "Editar Imóvel" : "Cadastro de Imóvel"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* CORPO (COM SCROLL) */}
        <div className="max-h-[70vh] overflow-y-auto p-6">
          {success && (
            <div data-testid="success-message" className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
              {success}
            </div>
          )}
          {serverError && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <form id="cadastro-imovel-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-3">
                <div>
                  <label htmlFor="categoria" className="mb-0.5 block text-xs font-semibold text-slate-700">Categoria</label>
                  <select id="categoria" value={form.categoria} onChange={(e) => handleChange("categoria", e.target.value)} className={inputClass("categoria")}>
                    <option value="">Selecione</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                  </select>
                  {errors.categoria && <p className="mt-0.5 text-[10px] text-red-500">{errors.categoria}</p>}
                </div>
                <div>
                  <label htmlFor="endereco" className="mb-0.5 block text-xs font-semibold text-slate-700">Endereço</label>
                  <input id="endereco" type="text" value={form.endereco} onChange={(e) => handleChange("endereco", e.target.value)} placeholder="Ex: Rua Castro, 102" className={inputClass("endereco")} />
                  {errors.endereco && <p className="mt-0.5 text-[10px] text-red-500">{errors.endereco}</p>}
                </div>
                <div>
                  <label htmlFor="cep" className="mb-0.5 block text-xs font-semibold text-slate-700">CEP</label>
                  <input id="cep" type="text" value={form.cep} onChange={(e) => handleCEPChange(e.target.value)} placeholder="63-400-000" className={inputClass("cep")} />
                  {errors.cep && <p className="mt-0.5 text-[10px] text-red-500">{errors.cep}</p>}
                </div>
                <div>
                  <label htmlFor="cidade" className="mb-0.5 block text-xs font-semibold text-slate-700">Cidade</label>
                  <input id="cidade" type="text" value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} placeholder="Ex: Cedro" className={inputClass("cidade")} />
                  {errors.cidade && <p className="mt-0.5 text-[10px] text-red-500">{errors.cidade}</p>}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label htmlFor="tipo" className="mb-0.5 block text-xs font-semibold text-slate-700">Tipo de Imóvel</label>
                  <select id="tipo" value={form.tipo} onChange={(e) => handleChange("tipo", e.target.value)} className={inputClass("tipo")}>
                    <option value="">Selecione</option>
                    <option value="apartamento">Apartamento</option>
                    <option value="casa">Casa</option>
                    <option value="quarto">Quarto</option>
                    <option value="terreno">Terreno</option>
                  </select>
                  {errors.tipo && <p className="mt-0.5 text-[10px] text-red-500">{errors.tipo}</p>}
                </div>
                <div>
                  <label htmlFor="referencia" className="mb-0.5 block text-xs font-semibold text-slate-700">Referência</label>
                  <input id="referencia" type="text" value={form.referencia} onChange={(e) => handleChange("referencia", e.target.value)} placeholder="Ex: Próximo ao centro" className={inputClass("referencia")} />
                  {errors.referencia && <p className="mt-0.5 text-[10px] text-red-500">{errors.referencia}</p>}
                </div>
                <div>
                  <label htmlFor="estado" className="mb-0.5 block text-xs font-semibold text-slate-700">Estado</label>
                  <input id="estado" type="text" value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} placeholder="CE" maxLength={20} className={inputClass("estado")} />
                  {errors.estado && <p className="mt-0.5 text-[10px] text-red-500">{errors.estado}</p>}
                </div>
                <div>
                  <label htmlFor="descricao" className="mb-0.5 block text-xs font-semibold text-slate-700">Descrição</label>
                  <textarea id="descricao" value={form.descricao} onChange={(e) => handleChange("descricao", e.target.value)} rows={2} placeholder="Detalhes do imóvel..." className={inputClass("descricao")} />
                  {errors.descricao && <p className="mt-0.5 text-[10px] text-red-500">{errors.descricao}</p>}
                </div>
                <div>
                  <label htmlFor="valor" className="mb-0.5 block text-xs font-semibold text-slate-700">Valor (R$)</label>
                  <input id="valor" type="number" step="0.01" value={form.valor} onChange={(e) => handleChange("valor", e.target.value)} placeholder="0.00" className={inputClass("valor")} />
                  {errors.valor && <p className="mt-0.5 text-[10px] text-red-500">{errors.valor}</p>}
                </div>
              </div>
            </div>

            {/* SEÇÃO DE MÍDIAS EXISTENTES */}
            {isEditing && imovelData.midias && imovelData.midias.length > 0 && (
              <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900 uppercase mb-3">Mídias Atuais</p>
                <div className="grid grid-cols-4 gap-2">
                  {imovelData.midias.map((midia) => {
                    const isRemoved = removedMediaIds.includes(midia.id);
                    const url = midia.arquivo.startsWith('http') ? midia.arquivo : `${API_BASE_URL}${midia.arquivo}`;
                    return (
                      <div key={midia.id} className={`relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-white transition-opacity ${isRemoved ? 'opacity-30 grayscale' : ''}`}>
                        <img src={url} alt="Mídia" className="h-full w-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => isRemoved ? unmarkMediaForRemoval(midia.id) : markMediaForRemoval(midia.id)}
                          className={`absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm transition ${isRemoved ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
                        >
                          {isRemoved ? "↺" : "✕"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SEÇÃO DE NOVAS MÍDIAS */}
            <div className="rounded-xl border border-gray-100 bg-slate-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-slate-900 uppercase">
                  {isEditing ? "Adicionar Novas Mídias" : "Mídias"}
                </p>
                <button type="button" onClick={() => fileInputRef.current?.click()} className="rounded-full bg-[#219EBC] px-4 py-1.5 text-xs font-bold text-white transition hover:bg-[#1a86a1]">+ Adicionar</button>
                <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
              </div>
              <div className="space-y-2">
                {files.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-white p-4 text-center text-xs text-gray-400">
                    {isEditing ? "Selecione novas fotos/vídeos se desejar" : "Arraste ou selecione fotos e vídeos"}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs">
                        <span className="truncate pr-4 text-gray-600">{file.name}</span>
                        <button type="button" onClick={() => removeFile(index)} className="text-red-400 font-bold hover:text-red-600 transition">Remover</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ACTIONS */}
        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800">Cancelar</button>
          <button onClick={handleSubmit} disabled={loading} className="rounded-lg bg-emerald-600 px-8 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50">
            {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar Imóvel"}
          </button>
        </div>
      </div>
    </div>
  );
}
