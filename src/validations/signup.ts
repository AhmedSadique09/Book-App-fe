import * as yup from "yup";

export const signupSchema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .required("Username is required"),
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
  password: yup
    .string()
    .min(8, "Must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}\[\]:;"'<>,.?\\/@#])/,
      "Password must contain at least one number, one lowercase letter, one uppercase letter, and one special character",
    )
    .required("Password is required"),
});

export interface ISignup extends yup.InferType<typeof signupSchema> {}
