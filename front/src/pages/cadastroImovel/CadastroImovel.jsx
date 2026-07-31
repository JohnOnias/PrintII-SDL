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
  area: "",
  quartos: "",
  banheiros: "",
  garagem: false,
  suite: false,
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
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";

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
          area: imovelData.area !== undefined ? imovelData.area : "",
          quartos: imovelData.quartos !== undefined ? imovelData.quartos : "",
          banheiros: imovelData.banheiros !== undefined ? imovelData.banheiros : "",
          garagem: imovelData.garagem || false,
          suite: imovelData.suite || false,
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
          area: imovelData.area !== undefined ? imovelData.area : "",
          quartos: imovelData.quartos !== undefined ? imovelData.quartos : "",
          banheiros: imovelData.banheiros !== undefined ? imovelData.banheiros : "",
          garagem: imovelData.garagem || false,
          suite: imovelData.suite || false,
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
    const skipFields = ['garagem', 'suite', 'banheiros', 'area'];
    Object.entries(form).forEach(([key, value]) => {
      if (skipFields.includes(key)) return;
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
      formData.append("area", form.area || "");
      formData.append("quartos", form.quartos || 0);
      formData.append("banheiros", form.banheiros || 0);
      formData.append("garagem", form.garagem);
      formData.append("suite", form.suite);
      
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

  const selectClass = (field) =>
    `w-full rounded-[10px] border px-2 py-1.5 text-sm text-gray-700 outline-none transition focus:border-black appearance-none bg-white bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[right_8px_center] pr-7 ${
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
        <div className="px-6 py-4 text-center border-b border-gray-100">
          <h2 className="text-lg font-bold text-slate-900">
            {isEditing ? "Editar Imóvel" : "Cadastro de Imóvel"}
          </h2>
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
            <div className="grid gap-x-5 gap-y-3 sm:grid-cols-2">

              {/* === COLUNA ESQUERDA === */}
              
              {/* Linha 1 esquerda: Categoria */}
              <div>
                <label htmlFor="categoria" className="mb-0.5 block text-xs font-semibold text-slate-700">Categoria</label>
                <select id="categoria" value={form.categoria} onChange={(e) => handleChange("categoria", e.target.value)} className={selectClass("categoria")}>
                  <option value="">Selecione</option>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                </select>
                {errors.categoria && <p className="mt-0.5 text-[10px] text-red-500">{errors.categoria}</p>}
              </div>

              {/* Linha 1 direita: Tipo de Imóvel */}
              <div>
                <label htmlFor="tipo" className="mb-0.5 block text-xs font-semibold text-slate-700">Tipo de Imóvel</label>
                <select id="tipo" value={form.tipo} onChange={(e) => handleChange("tipo", e.target.value)} className={selectClass("tipo")}>
                  <option value="">Selecione</option>
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="quarto">Quarto</option>
                  <option value="terreno">Terreno</option>
                </select>
                {errors.tipo && <p className="mt-0.5 text-[10px] text-red-500">{errors.tipo}</p>}
              </div>

              {/* Linha 2 esquerda: Endereço */}
              <div>
                <label htmlFor="endereco" className="mb-0.5 block text-xs font-semibold text-slate-700">Endereço</label>
                <input id="endereco" type="text" value={form.endereco} onChange={(e) => handleChange("endereco", e.target.value)} placeholder="Rua Castro, Numero 102" className={inputClass("endereco")} />
                {errors.endereco && <p className="mt-0.5 text-[10px] text-red-500">{errors.endereco}</p>}
              </div>

              {/* Linha 2 direita: Número de quartos */}
              <div>
                <label htmlFor="quartos" className="mb-0.5 block text-xs font-semibold text-slate-700">Número de quartos</label>
                <select id="quartos" value={form.quartos} onChange={(e) => handleChange("quartos", e.target.value)} className={selectClass("quartos")}>
                  <option value="">Selecione</option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                  ))}
                </select>
                {errors.quartos && <p className="mt-0.5 text-[10px] text-red-500">{errors.quartos}</p>}
              </div>

              {/* Linha 2.5 esquerda: Número de banheiros */}
              <div>
                <label htmlFor="banheiros" className="mb-0.5 block text-xs font-semibold text-slate-700">Número de banheiros</label>
                <select id="banheiros" value={form.banheiros} onChange={(e) => handleChange("banheiros", e.target.value)} className={selectClass("banheiros")}>
                  <option value="">Selecione</option>
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, "0")}</option>
                  ))}
                </select>
                {errors.banheiros && <p className="mt-0.5 text-[10px] text-red-500">{errors.banheiros}</p>}
              </div>

              {/* Linha 2.5 direita: Área */}
              <div>
                <label htmlFor="area" className="mb-0.5 block text-xs font-semibold text-slate-700">Área Útil (m²)</label>
                <input id="area" type="number" value={form.area} onChange={(e) => handleChange("area", e.target.value)} placeholder="Ex: 100" className={`${inputClass("area")} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} />
                {errors.area && <p className="mt-0.5 text-[10px] text-red-500">{errors.area}</p>}
              </div>

              {/* Linha 3 esquerda: CEP */}
              <div>
                <label htmlFor="cep" className="mb-0.5 block text-xs font-semibold text-slate-700">CEP</label>
                <input id="cep" type="text" value={form.cep} onChange={(e) => handleCEPChange(e.target.value)} placeholder="63-400.000" className={inputClass("cep")} />
                {errors.cep && <p className="mt-0.5 text-[10px] text-red-500">{errors.cep}</p>}
              </div>

              {/* Linha 3 direita: Referência */}
              <div>
                <label htmlFor="referencia" className="mb-0.5 block text-xs font-semibold text-slate-700">Referência</label>
                <input id="referencia" type="text" value={form.referencia} onChange={(e) => handleChange("referencia", e.target.value)} placeholder="Próximo ao teatro Dragão do Mar" className={inputClass("referencia")} />
                {errors.referencia && <p className="mt-0.5 text-[10px] text-red-500">{errors.referencia}</p>}
              </div>

              {/* Linha 4 esquerda: Cidade */}
              <div>
                <label htmlFor="cidade" className="mb-0.5 block text-xs font-semibold text-slate-700">Cidade</label>
                <input id="cidade" type="text" value={form.cidade} onChange={(e) => handleChange("cidade", e.target.value)} placeholder="Ex: Fortaleza" className={inputClass("cidade")} />
                {errors.cidade && <p className="mt-0.5 text-[10px] text-red-500">{errors.cidade}</p>}
              </div>

              {/* Linha 4 direita: Estado */}
              <div>
                <label htmlFor="estado" className="mb-0.5 block text-xs font-semibold text-slate-700">Estado</label>
                <input id="estado" type="text" value={form.estado} onChange={(e) => handleChange("estado", e.target.value)} placeholder="Ceará" maxLength={20} className={inputClass("estado")} />
                {errors.estado && <p className="mt-0.5 text-[10px] text-red-500">{errors.estado}</p>}
              </div>

              {/* Linha 5 esquerda: Garagem / Suite checkboxes */}
              <div className="flex items-center gap-5 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition ${form.garagem ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"}`}>
                    {form.garagem && (
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Garagem</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className={`w-5 h-5 rounded flex items-center justify-center border-2 transition ${form.suite ? "bg-emerald-500 border-emerald-500" : "border-gray-300 bg-white"}`}>
                    {form.suite && (
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-700">Suite</span>
                </label>
                <input type="hidden" name="garagem" value={form.garagem} />
                <input type="hidden" name="suite" value={form.suite} />
              </div>

              {/* Linha 5 direita: Valor */}
              <div>
                <label htmlFor="valor" className="mb-0.5 block text-xs font-semibold text-slate-700">Valor</label>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R$</span>
                  <input id="valor" type="number" step="0.01" value={form.valor} onChange={(e) => handleChange("valor", e.target.value)} placeholder="600,00" className={`${inputClass("valor")} pl-8 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`} />
                </div>
                {errors.valor && <p className="mt-0.5 text-[10px] text-red-500">{errors.valor}</p>}
              </div>

              {/* Linha 6 esquerda: Descrição */}
              <div>
                <label htmlFor="descricao" className="mb-0.5 block text-xs font-semibold text-slate-700">Descrição</label>
                <textarea id="descricao" value={form.descricao} onChange={(e) => handleChange("descricao", e.target.value)} rows={3} placeholder="Ao todo existem 6 comodos. Tem boa ventilação e uma ótima vista para praia." className={inputClass("descricao") + " resize-none"} />
                {errors.descricao && <p className="mt-0.5 text-[10px] text-red-500">{errors.descricao}</p>}
              </div>

              {/* Linha 6 direita: Adicionar fotos ou vídeos */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Adicionar fotos ou vídeos</label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-500 text-white hover:bg-emerald-600 transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileSelect} className="hidden" />
                </div>

                {/* Mídias existentes (modo edição) */}
                {isEditing && imovelData.midias && imovelData.midias.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2 mb-2">
                    <div className="space-y-1">
                      {imovelData.midias.map((midia) => {
                        const isRemoved = removedMediaIds.includes(midia.id);
                        const fileName = midia.arquivo.split('/').pop();
                        return (
                          <div key={midia.id} className={`flex items-center justify-between text-xs px-2 py-1.5 rounded ${isRemoved ? "opacity-40 line-through" : ""}`}>
                            <span className="truncate text-gray-600 pr-2">{fileName}</span>
                            <button
                              type="button"
                              onClick={() => isRemoved ? unmarkMediaForRemoval(midia.id) : markMediaForRemoval(midia.id)}
                              className={`shrink-0 font-bold text-base leading-none transition ${isRemoved ? "text-emerald-500 hover:text-emerald-600" : "text-gray-400 hover:text-red-500"}`}
                            >
                              {isRemoved ? "↺" : "✕"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Novos arquivos */}
                {files.length > 0 && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-2">
                    <div className="space-y-1">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-xs px-2 py-1.5">
                          <span className="truncate text-gray-600 pr-2">{file.name}</span>
                          <button type="button" onClick={() => removeFile(index)} className="shrink-0 text-gray-400 hover:text-red-500 font-bold text-base leading-none transition">✕</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {files.length === 0 && !(isEditing && imovelData.midias && imovelData.midias.length > 0) && (
                  <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-center text-xs text-gray-400">
                    Nenhum arquivo selecionado
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* ACTIONS — Botões centralizados */}
        <div className="border-t border-gray-100 px-6 py-4 flex justify-center gap-5">
          <button
            type="button"
            onClick={onClose}
            className="px-10 py-2.5 text-sm font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-10 py-2.5 text-sm font-bold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition disabled:opacity-50"
          >
            {loading ? "Salvando..." : isEditing ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
