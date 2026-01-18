// app/result/page.tsx
import ClientResult from "./ClientResult";
import { personalityResults, PersonalityType } from "@/lib/personalityResults";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
  searchParams: Promise<{
    type?: PersonalityType;
  }>;
};

export async function generateMetadata({ searchParams }: Props) {
  const { type = "stable" } = await searchParams;

  const result = personalityResults[type];

  return {
    title: `2026 밸런스 게임 | ${result.name}`,
    description: `당신의 선택으로 완성된 2026년의 성향`,
    openGraph: {
      title: `2026년 나의 성향은?`,
      description: `${result.name} · ${result.catchphrase}`,
      images: [
        {
          url: "https://2026-balance-game2.vercel.app/og/main_2026.png",
          width: 1200,
          height: 630,
          alt: `2026 성향 밸런스 게임`,
        },
      ],
    },
  };  
}

export default async function Page({ searchParams }: Props) {
  const { type = "stable" } = await searchParams;

  return <ClientResult type={type} />;
}
