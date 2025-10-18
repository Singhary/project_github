import { auth } from "@clerk/nextjs/server";
import { NextResponse, type NextRequest } from "next/server";
import z from "zod";
import { success } from "zod/v4";
import { processMeeting } from "~/lib/assemblyai";
import { db } from "~/server/db";

const bodyParser = z.object({
  meetingUrl: z.string().url(),
  projectId: z.string(),
  meetingId: z.string(),
});

export const maxDuration = 300; // 5 minutes

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { meetingId, meetingUrl, projectId } = bodyParser.parse(body);

    const { summaries } = await processMeeting(meetingUrl);

    await db.issue.createMany({
      data: summaries.map((summary) => ({
        start: summary.start,
        end: summary.end,
        gist: summary.gist,
        summary: summary.summary,
        headline: summary.headline,
        meetingId,
      })),
    });

    await db.meeting.update({
        where: { 
            id: meetingId,
        },
        data: {
            status: 'COMPLETED',
            name: summaries[0]?.headline
        }
    })

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.log("[PROCESS_MEETING_ERROR]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// 3.5511