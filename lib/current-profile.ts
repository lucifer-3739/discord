import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export const currentProfile = async () => {
  const { userId } = auth();

  if (!userId) {
    return null;
  }

  try {
    const profile = await db.profile.findFirst({
      where: {
        userId, 
      },
    });
    return profile;
  } catch (error) {
    console.error('Error fetching profile:', error);

    return null;
  }
};
