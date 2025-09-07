import { parseNullValue, parseNumber, parseTrueOfFalse } from "./parsers";

export const intValid = (params) => {
  try {
    return parseNumber(params);
  } catch (msg) {
    throw msg;
  }
};
export const doubleValid = (params) => {
  try {
    return parseNumber(params);
  } catch (msg) {
    throw msg;
  }
};
export const boolValid = (params) => {
  try {
    return parseTrueOfFalse(params);
  } catch (msg) {
    throw msg;
  }
};
export const stringValid = (params) => {
  try {
    if (params.length === 0) throw new Error("please enter a valid string");

    return params;
  } catch (msg) {
    throw msg;
  }
};

export const nullValid = (params) => {
  try {
    return parseNullValue(params);
  } catch (msg) {
    throw msg;
  }
};

export const checkLength = (e, condition, errorMessage) => {
  try {
    if (condition) {
      // console.log(condition);
      // console.log(e.length);
      return e;
    } else throw new Error(errorMessage);
  } catch (m) {
    throw m;
  }
};

export const checkTypeThenParsing = (value, type) => {
  const result = {
    int: () => intValid(value),
    "vector<int>": () => intValid(value),
    double: () => doubleValid(value),
    "vector<double>": () => doubleValid(value),
    bool: () => boolValid(value),
    "vector<bool>": () => boolValid(value),
    string: () => stringValid(value),
    "vector<string>": () => stringValid(value),
  };
  try {
    return result[type]();
  } catch (msg) {
    throw msg;
  }
};
