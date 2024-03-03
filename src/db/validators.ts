import z from "zod";

export const userValidator = z.object({
  email: z.string().email(),
});

export const messsageValidator = z.object({
  content: z.string(),
  userId: z.number(),
});
