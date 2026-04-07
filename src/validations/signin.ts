import * as yup from "yup";

const allowedDomains = [
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "mediverse.health",
];
const commonTLDs = ["com", "org", "net", "edu", "gov", "io", "health"];

export const signinSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .test("valid-email", "Invalid email address", (value) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        return false;
      }

      const domainParts = value.split("@")[1].split(".");
      const domain = value.split("@")[1];
      const tld = domainParts[domainParts.length - 1];

      if (allowedDomains.includes(domain)) {
        return true;
      }

      return commonTLDs.includes(tld) || domainParts.length > 2;
    }),
  password: yup.string().required("Password is required"),
});

export interface ISignin extends yup.InferType<typeof signinSchema> {}
