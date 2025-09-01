export const validationReg = ({ username, email, password }) => {
  const nameRegex = /^[A-Za-z0-9]{3,}$/gi;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gi;
  const passRegex = /^[a-zA-Z0-9]{9,}$/gi;
  return !nameRegex.test(username)
    ? "please you should get more than 4 characters ,they should has a English letters or numbers"
    : !emailRegex.test(email)
    ? "please enter a valid email!"
    : !passRegex.test(password)
    ? "password should be non-lettel than 9 characters , each one of them maybe a number or capital letter or lower letter "
    : "";
};
