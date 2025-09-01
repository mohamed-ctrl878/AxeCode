import { boolValid, doubleValid, intValid } from "./validation";

export const executionValidType = (type, val) => {
  if (type.includes("int")) return intValid(val);
  else if (type.includes("double")) return doubleValid(val);
  else if (type.includes("bool")) return boolValid(val);
  else return val;
};