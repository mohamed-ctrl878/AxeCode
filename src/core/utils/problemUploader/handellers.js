export const nextStep = (current, sizeOfSteps) => {
  if (current < sizeOfSteps - 1) return current + 1;
  else return current;
};
export const prevStep = (current) => {
  if (current > 0) return current - 1;
  else return current;
};

export const handelSetInputNums = (val) => {
  return parseInt(val) || 0;
};

export const handelType = (i, ArrOfTypes, type) => {
  ArrOfTypes[i] = type;
  return ArrOfTypes;
};

export const handelChangeValueBasic = (e) => {
  return e.target.value;
};

export const handelChangeListnerTsts = (prev, idx, change) => {
  const filt = prev.map((f, ids) => {
    if (ids == idx) return change;
    else return f;
  });
  return filt;
};



export function checkAllTrue(arr) {
    if (!Array.isArray(arr)) {
        return false;
    }
    
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        
        if (Array.isArray(element)) {
            if (!checkAllTrue(element)) {
                return false;
            }
        } 
        else {
            if (element === false) {
                return false;
            }
        }
    }
    
    return true;
}


