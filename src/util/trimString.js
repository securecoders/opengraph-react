
export const trimString = (stringIn = '', trimLen) => {
  let stringLen = stringIn.length;
  return stringLen > trimLen ?
    stringIn.substring(0, trimLen - 3) + "..." :
    stringIn;
};
