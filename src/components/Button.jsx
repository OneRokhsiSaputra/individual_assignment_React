import React from "react";

const Button = React.forwardRef(({ children, className, onClick }, ref) => {
  return (
    <button
      className={`flex h-[70px] transform select-none items-center justify-center rounded-sm bg-light-200 text-xl font-[400] text-textDark outline-none transition-all hover:bg-blue-500 hover:text-white focus:ring-2 focus:ring-blue-500 active:scale-95 active:bg-blue-700 dark:bg-dark-100 dark:text-text ${className}`}
      onClick={onClick}
      ref={ref}
    >
      {children}
    </button>
  );
});

export default Button;
