import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export const initialProfile = async () => {
  let user;
  try {
    user = await currentUser();
    console.log("User object returned from Clerk:", user);

    if (!user) {
      return auth().redirectToSignIn();
    }


    const profile = await db.profile.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (profile) {
      console.log("Profile found for user:", user.id);
      return profile;
    }
    const newProfile = await db.profile.create({
      data: {
        userId: user.id,
        name: `${user.firstName || ""} ${user.lastName || ""}`,
        imageUrl: user.imageUrl || "",
        email: user.emailAddresses?.[0]?.emailAddress || "",
      },
    });
    return newProfile;
  } catch (error: any) {
    console.error("Error in initialProfile:", error.message || error);
  }
};
