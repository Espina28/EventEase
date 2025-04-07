import React from "react";
export default function CustomButton({ children, className, fontSize = "text-base", ...props }) {
    return (
      <button
        className={`bg-blue-500 text-white font-bold p-4 w-full rounded-md shadow-md ${fontSize} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }