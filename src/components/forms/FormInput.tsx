import { X } from "lucide-react";

interface FormInputProps  {
  value: string;
  placeholder: string;
  onChange: (text: string) => void;
  Icon: React.ElementType;
  autoFocus?: boolean
}

const FormInput = ({ value, onChange, Icon, placeholder, autoFocus = false }: FormInputProps) => {
  const handleClear = () => {
    if (value) onChange("");
  };

  return (
    <div className="relative w-48 shadow-md">
      <span className="absolute -top-3 left-3 bg-light-100 dark:bg-dark-200 px-1 text-sm text-gray-700 dark:text-light-100">
        {placeholder}
      </span>
      <Icon size={22} className="absolute -left-7 top-[10px] text-slate-500 dark:text-light-100" strokeWidth={1.5}/>
      {value && (
        <X
          size={18}
          className="absolute right-1 top-3 cursor-pointer text-slate-500 hover:text-slate-400 transition-colors duration-300"
          onClick={handleClear}
          strokeWidth={1}
        />
      )}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        type="text"
        className="w-full border border-slate-700 dark:border-slate-400 rounded-md pl-4 pr-6 py-2 bg-transparent outline-none"
        autoFocus={autoFocus}
      />
    </div>
  );
};

export default FormInput;
