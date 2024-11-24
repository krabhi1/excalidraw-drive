import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type KeyValue<T> = Record<string | symbol | number, T>;
export type Falsy = "null" | "undefined" | "0" | "" | "false";
export function findFalsyKeys(
  obj: KeyValue<any>,
  falsy: Falsy[] = ["null", "undefined"]
) {
  return Object.keys(obj).filter((key) => {
    const value = obj[key];
    let valueType: string = typeof value;
    if (valueType === "object") {
      if (value === null) {
        valueType = "null";
      }
    } else if (valueType === "undefined") {
      valueType = "undefined";
    } else if (valueType === "string") {
      if (value === "") {
        valueType = "";
      }
    } else if (valueType === "boolean") {
      if (value === false) {
        valueType = "false";
      }
    }
    return falsy.includes(valueType as Falsy);
  });
}

export const scopes = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile"
]