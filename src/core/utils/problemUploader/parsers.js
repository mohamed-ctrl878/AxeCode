export const parseTrueOfFalse = (value) => {
  const trimVal = value.trim();
  try {
    if (trimVal === "true" || trimVal === "false") {
      return trimVal === "true";
    }
    throw new Error("you should put a valid boolean value");
  } catch (m) {
    throw m;
  }
};

export const parseNullValue = (value) => {
  const trimVal = value.trim();

  try {
    if (trimVal === "null") {
      return null;
    }

    throw new Error("you should put just a null");
  } catch (m) {
    throw m;
  }
};

export const parseNumber = (value) => {
  const parsingNum = parseInt(value);
  const comparison = parsingNum.toString();

  try {
    if (comparison !== "NaN") {
      return parsingNum;
    }
    throw new Error("you should put a valid number ");
  } catch (m) {
    throw m;
  }
};
