export const validateEmail = ({ requiredDomain = "", email }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { valid: false, message: "Invalid email format." };
  }

  if (!email.endsWith(requiredDomain)) {
    return {
      valid: false,
      message: `Email must end with ${requiredDomain}`,
    };
  }

  return { valid: true, message: "Valid email." };
};
