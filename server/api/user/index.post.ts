import { ZodError } from "zod";
import { prisma } from "~/prisma/db";
import { registerZodSchema } from "~/schemas/registerSchema";

export default defineEventHandler(async (event) => {
  const { name, email } = await readBody(event);

  try {
    registerZodSchema.parse({ name, email });

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });

    // setResponseStatus(event, 201);

    return {
      ok: true,
      method: "POST",
      message: "User created",
      data: newUser,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Internal server error",
    });
  }
});
