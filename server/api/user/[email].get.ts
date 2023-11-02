import { prisma } from "~/prisma/db";

export default defineEventHandler(async (event) => {
  const email = getRouterParam(event, "email");

  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: "User not found",
      });
    }

    return user;
  } catch (error) {
    console.log(error);
  }
});
