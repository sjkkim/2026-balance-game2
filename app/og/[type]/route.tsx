// app/og/[type]/route.tsx
import { ImageResponse } from "next/og";
import { personalityResults, PersonalityType } from "@/lib/personalityResults";

export const runtime = "edge";
 
export async function GET(
  req: Request,
  { params }: { params: { type: PersonalityType } }
) {
  const type = params.type ?? "stable";
  const result = personalityResults[type];

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
          fontSize: 48,
        }}
      >
        <div style={{ fontSize: 96 }}>{result.emoji}</div>
        <div>{result.name}</div>
        <div style={{ fontSize: 32 }}>{result.catchphrase}</div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
