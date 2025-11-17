export const validationRegInfo = ({ username, email }) => {
  const nameRegex = /^[A-Za-z0-9]{3,}$/i;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i;

  console.log(!nameRegex.test(username), username);
  console.log(!emailRegex.test(email), email);
  if (!nameRegex.test(username) && !emailRegex.test(email))
    throw new Error("please check your data inputs ");
  if (!nameRegex.test(username))
    throw new Error("please put a correct username  ");
  if (!emailRegex.test(email))
    throw new Error("please put a correct email valid@valid.com  ");

  return { username, email };
};
// search on problem
export function validatePassword(
  { password, confirmPassword },
  c,
  m,
  options = {}
) {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumber = true,
    requireSpecialChar = true,
    disallowSpaces = true,
  } = options;

  const errors = [];

  if (typeof password !== "string") {
    throw new Error("Password must be a string.");
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long.`);
  }

  if (disallowSpaces && /\s/.test(password)) {
    errors.push("Password must not contain spaces.");
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter.");
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number.");
  }

  if (
    requireSpecialChar &&
    !/[!@#$%^&*()\-\_=+\[\]{};:'\"\\|,.<>\/?`~]/.test(password)
  ) {
    errors.push("Password must contain at least one special character.");
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    errors.push("Passwords do not match.");
  }

  if (errors.length > 0) {
    throw new Error(errors.join(" | "));
  }

  return password;
}

const validPhone = (phone) => {
  const phoneNum = phone.trim();
  if (
    (phoneNum.length === 11 || phoneNum.length === 10) &&
    parseInt(phoneNum) != "NaN"
  )
    return phoneNum;

  throw new Error("please put a Valid phone number");
};

const ValidName = (name) => {
  const nameWithoutSpaces = name.trim();

  if (nameWithoutSpaces.length) return nameWithoutSpaces;
  throw new Error("please put a valid name ");
};

export const validBirthDay = (birthDay) => {
  let year = "";
  for (let date of birthDay) {
    if (date === "-") break;
    year += date;
  }

  const dateNow = new Date().getFullYear();
  year = +year;
  console.log(year);
  console.log(dateNow - year);

  if (dateNow - year > 12 && dateNow - year < 150) return birthDay;
  throw new Error("please put a valid Date");
};
export const infoRigisterValidDataContainer = (data) => {
  const phone = validPhone(data?.phone);
  const firstName = ValidName(data?.firstname);
  const firstLast = ValidName(data?.lastname);
  const birthDay = validBirthDay(data?.birthday);

  return data;
};
