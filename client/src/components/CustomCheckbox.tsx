interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

const CustomCheckbox = ({ label, checked, onChange, disabled = false }: CustomCheckboxProps) => {
  const id = `checkbox-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <div className="custom-checkbox">
      <input
        id={id}
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={onChange}
      />

      <label
        htmlFor={id}
        className={`
          flex items-center px-4 py-3 bg-white border-2 border-mood-blue-100 rounded-lg transition select-none
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          peer-checked:border-mood-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-mood-blue-600 hover:border-mood-blue-600
        `}
      >
        {/* Custom visual checkbox */}
        <div
          className={`
            mr-2 w-4 h-4 border-2 border-mood-blue-200 rounded-sm flex items-center justify-center transition
            ${checked ? "bg-mood-blue-600 border-mood-blue-600" : "border-mood-blue-200"}
          `}
        >
          {checked && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Visible label text */}
        <span className="text-[18px]/[1.4]">{label}</span>
      </label>
    </div>
  );
};

export default CustomCheckbox;
