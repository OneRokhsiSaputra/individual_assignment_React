import React from "react";
const Switch = ({ options, selectedIndex, onClick }) => {
  return (
    <div className="h-10 overflow-hidden rounded">
      <div className="relative flex h-full">
        {options.map((option, index) => {
          return (
            <div
              key={index}
              className={`flex flex-1 cursor-pointer items-center justify-center bg-white dark:bg-secondary ${
                index === selectedIndex ? "text-white" : "text-gray-800 dark:text-gray-400"
              }`}
              onClick={() => onClick(index)}
            >
              <span className="z-10 text-xs capitalize transition-colors duration-300">{option}</span>
            </div>
          );
        })}
        <div
          className="absolute h-full rounded bg-primary transition-all duration-300"
          style={{
            width: `${100 / options.length}%`,
            left: `${(100 / options.length) * selectedIndex}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default Switch;
