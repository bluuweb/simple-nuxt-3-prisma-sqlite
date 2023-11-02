import z from "zod";

export const emailZodSchema = z.object({
  email: z.string().email("Invalid email"),
});
