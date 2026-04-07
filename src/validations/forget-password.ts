import * as yup from "yup";

export const forgetPasswordSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Invalid email format")
    .required("Email is required"),
});

export interface IForgetPassword
  extends yup.InferType<typeof forgetPasswordSchema> {}
