export default function Input({
  nome,
  placeholder,
  tipo = "text",
  value,
  onChange,
  disabled = false,
  id,
  erro = false
}) {
  const inputId = id || `input-${nome.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div>
      <label 
        htmlFor={inputId}
        className="block text-xs font-semibold text-gray-700 mb-1"
      >
        {nome}
      </label>

      <input
        id={inputId}
        type={tipo}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full h-[45px] px-4 bg-gray-100 rounded-lg text-sm border border-gray-400 ${erro ? 'text-red-600 placeholder:text-red-400' : 'text-gray-700'}`}
      />
    </div>
  );
}