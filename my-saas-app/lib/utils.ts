import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// 👇 انتبه: كلمة export ضرورية جداً هنا
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}