import {z} from "Zod"

export const signInSchema = z.object({
  identifier: z.string(), // Expecting a string for the identifier (e.g., email or username)
  password: z.string(),   // Expecting a string for the password
});
