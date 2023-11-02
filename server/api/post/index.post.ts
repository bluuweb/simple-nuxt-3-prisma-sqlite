import { ZodError } from "zod";
import { prisma } from "~/prisma/db";
import { postZodSchema } from "~/schemas/postSchem";

export default defineEventHandler(async (event) => {
  const { title, content, authorEmail } = await readBody(event);

  try {
    postZodSchema.parse({
      title,
      content,
      authorEmail,
    });

    const user = await prisma.user.findUnique({
      where: {
        email: authorEmail,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: {
          connect: {
            id: user.id,
          },
        },
      },
    });

    console.log(post);

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: "Post not found",
      });
    }

    return {
      ok: true,
      method: "POST",
      message: "Post created",
      data: post,
    };
  } catch (error) {
    console.dir(error);

    if (error instanceof ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: error.issues[0].message,
      });
    }

    throw createError({
      statusCode: 500,
      statusMessage: "Error de prisma",
    });
  }
});
