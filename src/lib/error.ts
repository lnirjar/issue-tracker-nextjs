import { isHttpError } from "http-errors";
import { UNKNOWN_ERROR_MESSAGE } from "@/lib/constants";

export const handleError = (error: unknown) => {
  let status = 500;
  let message = UNKNOWN_ERROR_MESSAGE;
  if (isHttpError(error)) {
    status = error.statusCode;
    message = error.message;
  }

  if (status === 500) {
    console.error(error);
  }

  return { status, message };
};
