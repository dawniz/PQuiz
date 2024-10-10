import { createCustomError } from "../customError.js";

export default function tryCatchWrapper(func) {
  return async (req, res, next) => {
    try {
      await func(req, res, next);
    } catch (error) {
      console.log(error);
      return next(createCustomError(error, 400));
    }
  };
}
