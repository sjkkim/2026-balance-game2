// app/result/page.tsx
import ClientResult from "./ClientResult";
import { personalityResults, PersonalityType } from "@/lib/personalityResults";

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
    description: result.catchphrase,
    openGraph: {
      title: `2026년 성향: ${result.name}`,
      description: result.catchphrase,
      images: [
        {
          // ✅ 확장자 반드시 포함
          url: `/og/${type}.png`,
          width: 1200,
          height: 630,
          alt: `${result.name} 이미지`,
        },
      ],
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { type = "stable" } = await searchParams;

  return <ClientResult type={type} />;
}
