import { z } from "zod";

// { field: ["first message", ...] }. Show errors.field?.[0] in the form.
export const getFieldErrors = (error) => z.flattenError(error).fieldErrors;