import * as yup from "yup";

export const resetPasswordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .min(8, "Must be at least 8 characters")
    .max(50, "Password must be at most 50 characters")
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[-!$%^&*()_+|~=`{}\[\]:;"'<>,.?\\/@#])/,
      "Must contain a number, lowercase, uppercase, and special character",
    )
    .required("New password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

export interface IResetPassword
  extends yup.InferType<typeof resetPasswordSchema> {}
