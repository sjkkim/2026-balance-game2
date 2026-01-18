// share/ClientResult.tsx
"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { PersonalityType, personalityResults } from "@/lib/personalityResults";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Share2, LinkIcon } from "lucide-react";
import * as htmlToImage from "html-to-image";

type Props = {
  type: PersonalityType;
};

export default function ClientResult({ type }: Props) {
  const result = personalityResults[type];
  const router = useRouter();

  const [showCopied, setShowCopied] = useState(false);

  // 결과 영역 캡처용
  const resultRef = useRef<HTMLDivElement>(null);

  // 스토리용 캡처
  const storyRef = useRef<HTMLDivElement>(null);

  const handleRestart = () => {
    router.push("/"); // 질문 페이지로 이동
  };

  // 인스타그램 진입 감지
  const isInstagram = /Instagram/i.test(navigator.userAgent);

  return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">2026 신년 밸런스 게임</h1>
            <p className="text-muted-foreground">
              친구의 결과를 보고 오셨나요?
            </p>
          </div>
  
          <Button
            asChild
            size="lg"
            className="w-full text-lg"
          >
            <Link href={`/?from=share&type=${type}`}>
              <Sparkles className="mr-2" size={20} />
              나도 테스트 하러가기
            </Link>
          </Button>
        </div>
      </div>
  );
}
