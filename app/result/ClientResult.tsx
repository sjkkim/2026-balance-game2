// result/ClientResult.tsx
"use client";

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

  const saveResultImage = async () => {
    if (!resultRef.current) return;

    const dataUrl = await htmlToImage.toPng(resultRef.current, {
      backgroundColor: "#ffffff",
      pixelRatio: 2,
    });

    const link = document.createElement("a");
    link.download = "2026-밸런스게임-결과.png";
    link.href = dataUrl;
    link.click();
  };

  const saveStoryImage = async () => {
    if (!storyRef.current) return;

    // 임시 표시
    storyRef.current.style.opacity = "1";

    try {
      const dataUrl = await htmlToImage.toPng(storyRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = "2026-balance-story.png";
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error("스토리 캡처 실패", e);
    } finally {
      storyRef.current.style.opacity = "0";
    }
  };

  const handleShare = async () => {
    const origin = window.location.origin;
  
    // ✅ 공유 전용 페이지로 보냄
    const shareUrl = `${origin}/share?type=${type}`;
  
    const text = `${result.emoji} 나의 2026년 성향은 "${result.name}"!\n${result.catchphrase}"\n너의 2026년은 어떤 타입일까? 👀`;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "2026 신년 밸런스 게임",
          text,
          url: shareUrl,
        });
        return;
      } catch {
        // 공유 취소
      }
    }
  
    try {
      await navigator.clipboard.writeText(`${text}\n${shareUrl}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  

  // 공통으로 사용할 handleShare 함수
  // const handleShare = async () => {
  //   // 첫 페이지 URL
  //   const url = window.location.origin;

  //   // 공유 텍스트
  //   const text = `2026 신년 밸런스 게임! 너의 2026년은 어떤 타입일까? 👀`;

  //   // 네이티브 공유 API 지원 시
  //   if (navigator.share) {
  //     try {
  //       await navigator.share({
  //         title: "2026 신년 밸런스 게임",
  //         text,
  //         url,
  //       });
  //       return;
  //     } catch {
  //       // 공유 취소 → 아래 복사 fallback
  //     }
  //   }

  //   // 클립보드 복사 fallback
  //   try {
  //     await navigator.clipboard.writeText(`${text}\n${url}`);
  //     setShowCopied(true);
  //     setTimeout(() => setShowCopied(false), 2000);
  //   } catch (err) {
  //     console.error("Failed to copy:", err);
  //   }
  // };


  const handleRestart = () => {
    router.push("/"); // 질문 페이지로 이동
  };

  // 인스타그램 진입 감지
  const isInstagram = /Instagram/i.test(navigator.userAgent);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-2xl p-8 md:p-12 relative z-10 border-2 shadow-lg">
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="text-primary" size={28} />
              <h2 className="text-2xl md:text-3xl font-bold text-primary">2026 신년 성향 테스트</h2>
              <Sparkles className="text-primary" size={28} />
            </div>
            <p className="text-muted-foreground text-lg">당신의 2026년 성향은...</p>
          </div>

          {/* 결과 카드 */}
          <div ref={resultRef} className="space-y-6">
            <div className="text-center p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 rounded-2xl border-2 border-primary/30 space-y-4 shadow-lg">
              <div className="text-7xl mb-2">{result.emoji}</div>
              <h3 className="text-3xl md:text-4xl font-bold text-foreground font-semibold">{result.name}</h3>
              <p className="text-xl md:text-2xl font-medium text-primary text-balance text-lg font-medium ">
                "{result.catchphrase}"
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-secondary rounded-xl space-y-3 border border-border">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <span className="text-2xl">{result.emoji}</span>
                  <span className="font-semibold text-lg">성향 분석</span>
                </h4>
                <p className="text-foreground/80 leading-relaxed text-pretty">{result.description}</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl space-y-3 border border-primary/20">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                  <Sparkles className="text-primary" size={20} />
                  <span>2026년 당신의 모습</span>
                </h4>
                <p className="text-foreground/80 leading-relaxed text-pretty">{result.yearPreview}</p>
              </div>

              <div className="p-6 bg-accent/20 rounded-xl border-2 border-accent/40">
                <p className="text-base font-medium italic text-center text-lg font-medium text-balance leading-relaxed text-foreground">
                  {result.advice}
                </p>
              </div>
            </div>
          </div>

          {/* 스토리 저장용 */}
          <div
            ref={storyRef}
            className="fixed top-0 left-0 w-[1080px] h-[1920px] opacity-0 pointer-events-none bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 flex items-center justify-center"
          >
            <div className="w-[860px] rounded-3xl bg-white p-14 text-center shadow-xl space-y-8">
              <div className="text-8xl">{result.emoji}</div>
              <h3 className="text-5xl font-bold text-foreground">{result.name}</h3>
              <p className="text-2xl font-medium text-primary italic">“{result.catchphrase}”</p>
              <p className="text-xl text-foreground/80 leading-relaxed line-clamp-5">{result.yearPreview}</p>
              <div className="pt-8 text-sm text-foreground/40">@2026_nov</div>
            </div>
          </div>

          {/* 인스타그램 안내 */}
          {isInstagram && (
            <div className="mt-6 rounded-xl bg-yellow-50 border border-yellow-200 p-4 text-center space-y-2">
              <p className="text-sm text-yellow-800 font-medium">
                📸 인스타 앱에서는 이미지 저장이 제한돼요
              </p>
              <p className="text-xs text-yellow-700 leading-relaxed">
                우측 상단 <b>⋯</b> 버튼을 눌러<br />
                <b>“브라우저에서 열기”</b>로 접속하면<br />
                이미지 저장이 가능해요!
              </p>

              <button
                onClick={() => window.open(window.location.href, "_blank")}
                className="mt-2 inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm text-white"
              >
                🌐 브라우저에서 열기
              </button>
            </div>
          )}

          {/* 하단 버튼 */}
          <div className="flex flex-col gap-3 justify-center pt-4">
            <button
              onClick={saveStoryImage}
              disabled={isInstagram}
              className={`mt-6 rounded-xl px-4 py-2 text-white ${
                isInstagram ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-black/90"
              }`}
            >
              📸 결과 이미지 저장
            </button>

            {/* <Button onClick={handleShare} size="lg" className="px-8 text-lg">
              {showCopied ? (
                <>
                  <LinkIcon className="mr-2" size={20} />
                  링크 복사됨!
                </>
              ) : (
                <>
                  <Share2 className="mr-2" size={20} />
                  🔗 결과 공유하기
                </>ㄹ
              )}
            </Button> */}
            <Button
            onClick={handleShare}
            size="lg"
            className="px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
            style={{ backgroundColor: "lab(88 -5.47 -5.21)" }}
          >
            🔗 공유하기
            </Button>


            <Button
              onClick={handleRestart}
              size="lg"
              className="px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: "lab(88 -5.47 -5.21)" }}
            >
              <Sparkles className="mr-2" size={20} />
              다시 하기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
