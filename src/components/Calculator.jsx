import { ArrowUUpLeft, Clock, Divide, Dot, Equals, Minus, Percent, Plus, X } from "@phosphor-icons/react";
import { PlusMinus } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useRef, useState } from "react";
import Button from "./Button";
import NumericFormat from "./NumericFormat";

const Buttons = {
  row1: [
    {
      value: "AC",
      label: "AC",
      className: "bg-light-300 dark:bg-dark-300",
      type: "clear",
    },
    {
      value: "+/-",
      label: <PlusMinus size={25} />,
      className: "bg-light-300 dark:bg-dark-300",
      type: "plusminus",
    },
    {
      value: "%",
      label: <Percent size={25} />,
      className: "bg-light-300 dark:bg-dark-300",
      type: "percent",
    },
    {
      value: "/",
      label: <Divide size={25} />,
      className: "!bg-primary text-white",
      type: "operator",
    },
  ],
  row2: [
    { value: "7", label: "7", type: "number" },
    { value: "8", label: "8", type: "number" },
    { value: "9", label: "9", type: "number" },
    {
      value: "*",
      label: <X size={25} />,
      className: "!bg-primary text-white",
      type: "operator",
    },
  ],
  row3: [
    { value: "4", label: "4", type: "number" },
    { value: "5", label: "5", type: "number" },
    { value: "6", label: "6", type: "number" },
    {
      value: "-",
      label: <Minus size={25} />,
      className: "!bg-primary text-white",
      type: "operator",
    },
  ],
  row4: [
    { value: "1", label: "1", type: "number" },
    { value: "2", label: "2", type: "number" },
    { value: "3", label: "3", type: "number" },
    {
      value: "+",
      label: <Plus size={25} />,
      className: "!bg-primary text-white",
      type: "operator",
    },
  ],
  row5: [
    { value: "0", label: "0", className: "col-span-2", type: "number" },
    { value: ".", label: <Dot size={25} />, type: "dot" },
    {
      value: "=",
      label: <Equals size={25} />,
      className: "!bg-primary text-white",
      type: "equal",
    },
  ],
};

const Calculator = () => {
  const buttonsRef = useRef([]);
  const backspaceBtnRef = useRef(null);
  const [inputValue, setInputValue] = useState([]);
  const [result, setResult] = useState(0);
  const [calculated, setCalculated] = useState(false);
  const [history, setHistory] = useState([]);

  const handleButtonClick = (value) => {
    if (calculated && value !== "=") {
      setInputValue([]);
      setResult(0);
      setCalculated(false);
    }

    const button = Object.values(Buttons)
      .flat()
      .find((item) => item.value === value);

    let resultValue;
    if (calculated) {
      resultValue = BigInt(result).toString();
    }

    const lastInputValue = calculated
      ? {
          value: resultValue,
          label: resultValue,
          type: "number",
        }
      : inputValue[inputValue.length - 1];

    const handleUnaryOperations = (operation) => {
      if (lastInputValue && lastInputValue.type === "number") {
        const newInputValue = {
          ...lastInputValue,
          value: operation(lastInputValue.value),
          label: operation(lastInputValue.value),
        };
        setInputValue((prev) => [...prev.slice(0, -1), newInputValue]);
      }
    };

    const handleNumber = () => {
      if (lastInputValue && lastInputValue.type === "number") {
        let newValue = lastInputValue.value;
        if (lastInputValue.value.toString().length < 15) {
          newValue = lastInputValue.value + value;
        }
        const newInputValue = {
          ...lastInputValue,
          value: newValue,
          label: newValue,
        };
        setInputValue((prev) => [...prev.slice(0, -1), newInputValue]);
      } else {
        setInputValue((prev) => [...prev, button]);
      }
    };

    const handleOperator = () => {
      if (inputValue.length > 0) {
        if (lastInputValue && lastInputValue.type === "operator") {
          const newInputValue = {
            ...lastInputValue,
            value: button.value,
            label: button.label,
          };
          setInputValue((prev) => [...ArrowUUpLeft.slice(0, -1), newInputValue]);
        } else {
          setInputValue((prev) => [...prev.slice(0, -1), lastInputValue, button]);
        }
      }
    };

    const handleDot = () => {
      if (lastInputValue && lastInputValue.type === "number") {
        let newValue = lastInputValue.value;
        if (!lastInputValue.value.includes(".")) {
          newValue = lastInputValue.value + ".";
        }
        const newInputValue = {
          ...lastInputValue,
          value: newValue,
          label: newValue,
        };
        setInputValue((prev) => [...prev.slice(0, -1), newInputValue]);
      } else if (!lastInputValue || lastInputValue.type !== "number") {
        const newInputValue = { value: "0.", label: "0.", type: "number" };
        setInputValue((prev) => [...prev, newInputValue]);
      }
    };

    const handleClear = () => {
      setInputValue([]);
      setResult(0);
      setCalculated(false);
    };

    const handleEqual = () => {
      if (inputValue.length > 0) {
        calulate();
      }
    };

    switch (button.type) {
      case "number":
        handleNumber();
        break;
      case "operator":
        handleOperator();
        break;
      case "plusminus":
        handleUnaryOperations((num) => -num);
        break;
      case "percent":
        handleUnaryOperations((num) => num / 100);
        break;
      case "dot":
        handleDot();
        break;
      case "clear":
        handleClear();
        break;
      case "equal":
        handleEqual();
        break;
    }
  };

  const handleKeyButtonPress = (btn) => {
    buttonsRef.current[btn].click();
    buttonsRef.current[btn].classList.add("ring-2", "ring-blue-500");
    setTimeout(() => {
      buttonsRef.current[btn].classList.remove("ring-2", "ring-blue-500");
    }, 200);
  };

  const handleKeyPress = (e) => {
    if (buttonsRef.current[e.key]) {
      handleKeyButtonPress(e.key);
    }

    if (e.key === "Backspace") {
      backspaceBtnRef.current && backspaceBtnRef.current.click();
    }

    if (e.key === "Enter") {
      handleKeyButtonPress("=");
    }
    if (e.key === "ArrowUp") {
      history.length > 1 && handleRestoreHistory(history[history.length - 1]);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const handleBackspace = () => {
    if (inputValue.length > 0) {
      const lastInputValue = inputValue[inputValue.length - 1];
      if (lastInputValue.type === "number" && lastInputValue.value.toString().length > 1) {
        const newInputValue = {
          ...lastInputValue,
          value: lastInputValue.value.slice(0, -1),
          label: lastInputValue.value.slice(0, -1),
        };
        setInputValue((prev) => [...prev.slice(0, -1), newInputValue]);
      } else {
        setInputValue((prev) => [...prev.slice(0, -1)]);
      }
    }
  };

  const calulate = () => {
    const inputValueToCalculate = [...inputValue];
    const lastInputValue = inputValueToCalculate[inputValueToCalculate.length - 1];

    if (lastInputValue && lastInputValue.type === "operator") {
      inputValueToCalculate.pop();
      setInputValue(inputValueToCalculate);
    }

    const expression = inputValueToCalculate
      .map((item) => {
        if (item.type === "number") {
          return Number(item.value);
        }
        return item.value;
      })
      .join("");

    try {
      const newResult = eval(expression);
      if (isNaN(newResult) || !isFinite(newResult)) {
        throw new Error("invalid Expression");
      }
      setResult(newResult);
      setCalculated(true);
      setHistory((prev) => [...prev, { inputValue, result: newResult }]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRestoreHistory = (historyItem) => {
    setInputValue(historyItem.inputValue);
    setResult(historyItem.result);
    setCalculated(true);
    setHistory((prev) => prev.slice(0, -1));
  };

  const renderInputValue = () => {
    if (!inputValue.length) return <span>0</span>;
    return inputValue.map((item, index) => {
      return item.type === "number" ? (
        <NumericFormat key={index} value={item.value} />
      ) : (
        <span key={index} className="text-primary">
          {item.label}
        </span>
      );
    });
  };

  return (
    <>
      <div className="mb-2 px-4">
        <div className="flex min-h-[9rem] flex-col items-end justify-end py-4 text-right">
          {history.length > 1 && (
            <div
              className="mb-4 flex cursor-pointer items-center gap-2 rounded-full bg-light-200 px-2 py-0.5 text-xs dark:bg-dark-300"
              onClick={() => handleRestoreHistory(history[history.length - 2] || history[history.length - 1])}
            >
              <Clock size={15} />
              <NumericFormat value={history[history.length - 2].result || history[history.length - 1].result} />
            </div>
          )}

          <NumericFormat
            value={result}
            className="w-full text-6xl text-textDark dark:text-white"
            maxLimit={20}
            autoTextSize={{
              mode: "oneline",
              minFontSize: 20,
              maxFontSize: 50,
            }}
          />
        </div>
      </div>
      <div className="flex items-center justify-center bg-light-100 px-4 py-2 dark:bg-dark-100">
        <span
          className="mr-3 cursor-pointer hover:text-black dark:hover:text-white"
          ref={backspaceBtnRef}
          onClick={handleBackspace}
        >
          <ArrowUUpLeft size={20} />
        </span>
        <div className="flex w-full items-center overflow-x-auto text-2xl font-extralight [&>*:first-child]:ml-auto ">
          {renderInputValue()}
        </div>
      </div>
      {/* Keyboard */}
      <div className="flex item-center justify-between p-4">
        <div className="flex w-full flex-col gap-1 rounded-lg">
          {Object.keys(Buttons).map((key) => (
            <div className="grid grid-cols-4 gap-1" key={key}>
              {Buttons[key].map((item) => (
                <Button
                  key={item.value}
                  className={"w-full" + " " + item.className || ""}
                  ref={(button) => {
                    buttonsRef.current[item.value] = button;
                  }}
                  onClick={() => handleButtonClick(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Calculator;
