export default function Input({
  nome,
  placeholder,
  tipo = "text",
  value,
  onChange,
  disabled = false
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">
        {nome}
      </label>

      <input
        type={tipo}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full h-[45px] px-4 bg-gray-100 rounded-lg text-sm text-gray-700 border border-gray-400"
      />
    </div>
  );
}