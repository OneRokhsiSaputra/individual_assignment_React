import { AutoTextSize } from "auto-text-size";
import React from "react";

const NumericFormat = ({ value, maxLimit, className, autoTextSize }) => {
  let formatedText = Number(value);
  if (maxLimit && value.toString().length > maxLimit) {
    formatedText = Number.parseFloat(formatedText).toExponential(2);
  }
  formatedText = formatedText.toLocaleString();

  return (
    <span className={`select-none ${className}`}>
      {autoTextSize ? (
        <AutoTextSize
          mode={autoTextSize.mode}
          minFontSizePx={autoTextSize.minFontSizePx}
          maxFontSizePx={autoTextSize.maxFontSizePx}
          as={"p"}
          className="ml-auto"
        >
          {formatedText}
        </AutoTextSize>
      ) : (
        formatedText
      )}
    </span>
  );
};

export default NumericFormat;
