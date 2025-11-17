export const getOutIdintify = (data, idintify, realIputValue) => {
  let counter = 0;

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      if (data[i][idintify] === realIputValue) counter++;
    }
  }
  return counter;
};
