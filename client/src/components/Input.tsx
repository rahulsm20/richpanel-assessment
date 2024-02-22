import { ChangeEvent } from "react";

type InputProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
  name: string;
  label?: string;
  accept?: string;
  className?: string;
};

const Input = ({ name, label, type, onChange, accept,className }: InputProps) => {
  const textInputTypes = ['email','password','text']
  return (
    <div className="flex flex-col gap-2 text-sm">
      <label htmlFor={name} className="flex">
        {label ? label : name}
      </label>
      <input
        accept={accept}
        className={textInputTypes.includes(type) ? "input input-bordered input-sm border border-gray-300 bg-white text-black": className}
        name={name}
        type={type}
        onChange={onChange}
      ></input>
    </div>
  );
};

export default Input;
