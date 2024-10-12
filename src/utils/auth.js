export const validationSuccess = ({
  name,
  email,
  password,
  confirmPassword,
}) => {
  const formError = {};
  if (!name) {
    formError.name = "Name is required";
  } else if (name.length < 3) {
    formError.name = "Name must be at least 3 characters long";
  }
  if (!email) {
    formError.email = "Email is required";
  } else if (!email.endsWith("@gmail.com")) {
    formError.email = "Enter a valid email";
  }

  if (!password) {
    formError.password = "Password is required";
  } else if (password.length < 6) {
    formError.password = "Password must be at least 6 characters long";
  }

  if (!confirmPassword) {
    formError.confirmPassword = "Confirm Password is required";
  } else if (confirmPassword !== password) {
    formError.confirmPassword = "Passwords do not match";
  }
  return formError;
};
