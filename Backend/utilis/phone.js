import { parsePhoneNumberFromString } from "libphonenumber-js";

export function normalizePhone(input, defaultRegion = "IN") {
  // If user provides +cc, parse directly; else try default region
  const parsed =
    input?.startsWith("+")
      ? parsePhoneNumberFromString(input)
      : parsePhoneNumberFromString(input, defaultRegion);

  if (!parsed || !parsed.isValid()) {
    throw new Error("Invalid phone number");
  }
  return parsed.number; // E.164 format
}