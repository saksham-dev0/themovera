import { ReactNode } from "react";

export function Dialog({ children }: { children: ReactNode }) {
  return (
    <div className="bg-ink-800/40 rounded-md py-14 px-8 grid place-items-center">
      <div className="bg-white rounded-md shadow-floating max-w-[440px] w-full overflow-hidden">
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({ onClose }: { onClose?: () => void }) {
  return (
    <div className="flex items-center justify-between px-7 pt-5.5">
      <div className="w-11 h-11 bg-teal-100 rounded-sm grid place-items-center font-display font-bold text-lg text-teal-500">
        M
      </div>
      <button
        aria-label="Close"
        onClick={onClose}
        className="w-9 h-9 border-none bg-gray-50 hover:bg-gray-100 rounded-pill text-ink-600 text-[15px] cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}
