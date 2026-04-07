import * as yup from "yup";

export const otpSchema = yup.object().shape({
  otp: yup
    .string()
    .length(6, "OTP must be 6 digits")
    .matches(/^\d{6}$/, "OTP must contain only numbers")
    .required("OTP is required"),
});

export interface IOTP extends yup.InferType<typeof otpSchema> {}
