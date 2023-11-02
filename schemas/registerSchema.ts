import z from "zod";

export const registerZodSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Must be at least 2 characters"),
});
