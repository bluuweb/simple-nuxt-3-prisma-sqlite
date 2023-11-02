import z from "zod";

export const postZodSchema = z.object({
  email: z.string().email("Invalid email"),
  title: z.string().min(2).max(50),
  content: z.string().min(2).max(1000),
});
