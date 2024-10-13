import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, imageUrl } = await req.json();

    // Validate the request body
    if (!name || !imageUrl) {
      return new NextResponse("Name and image URL are required", { status: 400 });
    }

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [{ name: "general", profileId: profile.id }]
        },
        members: {
          create: [{ profileId: profile.id, role: MemberRole.ADMIN }]
        }
      }
    });

    // Optionally return specific details
    return NextResponse.json({
      id: server.id,
      name: server.name,
      imageUrl: server.imageUrl,
      inviteCode: server.inviteCode,
    });
  } catch (error) {
    console.error("[SERVERS_POST]", error); // Log the complete error object
    return new NextResponse("Internal Error", { status: 500 });
  }
}
