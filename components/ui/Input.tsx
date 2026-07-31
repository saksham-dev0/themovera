import { InputHTMLAttributes, LabelHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const fieldBase =
  "w-full min-w-0 border-[1.5px] border-border outline-none px-5 py-3 font-sans text-[15px] text-ink-800 bg-gray-100 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(26,127,114,0.15)] transition-shadow";

export function Input({ className = "", error, ...props }: InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      className={`${fieldBase} rounded-pill ${error ? "border-danger focus:shadow-[0_0_0_4px_rgba(200,80,60,0.12)]" : ""} ${className}`}
      {...props}
    />
  );
}

export function Textarea({ className = "", ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${fieldBase} rounded-md resize-y ${className}`} {...props} />;
}

export function Select({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={`${fieldBase} rounded-pill appearance-none ${className}`} {...props} />;
}

export function Label({ className = "", ...props }: LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={`font-display font-semibold text-sm text-ink-800 ${className}`} {...props} />;
}
