// app/ClientPage.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Share2, LinkIcon } from "lucide-react"

import { useRef } from "react";
import * as htmlToImage from "html-to-image";

// app/result/page.tsx
import { personalityResults , PersonalityType} from "@/lib/personalityResults";

import { useRouter } from "next/navigation";
import { useEffect } from "react";


// type PersonalityType = "stable" | "challenge" | "realistic" | "free"

type Question = {
  id: number
  question: string
  optionA: {
    text: string
    type: PersonalityType
  }
  optionB: {
    text: string
    type: PersonalityType
  }
}

type Answer = {
  questionId: number
  question: string
  selected: "A" | "B"
  option: string
  type: PersonalityType
}

type PersonalityResult = {
  emoji: string
  name: string
  catchphrase: string
  description: string
  yearPreview: string
  advice: string
}

const questions: Question[] = [
  {
    id: 1,
    question: "2026년, 더 끌리는 소식은?",
    optionA: { text: "예상 밖의 두둑한 보너스 💸", type: "challenge" },
    optionB: { text: "보장된 완벽한 연휴와 휴식 🛌", type: "stable" },
  },
  {
    id: 2,
    question: "새해 첫 출근, 내 마음은?",
    optionA: { text: "올해는 제대로 보여준다 🔥", type: "challenge" },
    optionB: { text: "일단 무사히 퇴근만 하자 😇", type: "free" },
  },
  {
    id: 3,
    question: "점심 메뉴를 고를 때 나는?",
    optionA: { text: "새로 생긴 핫플 도전 🤔", type: "free" },
    optionB: { text: "늘 먹던 안전한 메뉴 🍱", type: "realistic" },
  },
  {
    id: 4,
    question: "업무를 처리하는 스타일은?",
    optionA: { text: "빡세게 끝내고 칼퇴 🌅", type: "realistic" },
    optionB: { text: "내 페이스대로 천천히 🌙", type: "free" },
  },
  {
    id: 5,
    question: "주변의 부탁을 받았을 때?",
    optionA: { text: "책임지고 확실하게 도움 🙋", type: "stable" },
    optionB: { text: "가능한 선에서 쿨하게 OK 👍", type: "free" },
  },
  {
    id: 6,
    question: "갑작스러운 문제 발생 시?",
    optionA: { text: "즉시 해결책부터 찾기 💥", type: "challenge" },
    optionB: { text: "상황 정리 후 신중히 대처 📝", type: "stable" },
  },
  {
    id: 7,
    question: "퇴근 후 가장 큰 힐링은?",
    optionA: { text: "갓생러답게 운동/자기계발 🏃", type: "challenge" },
    optionB: { text: "침대 위에서 온전한 휴식 😴", type: "stable" },
  },
  {
    id: 8,
    question: "새로운 걸 시작할 때 나는?",
    optionA: { text: "충분히 알아보고 신중히 📚", type: "realistic" },
    optionB: { text: "흥미 생기면 일단 시작 💻", type: "challenge" },
  },
  {
    id: 9,
    question: "올해 휴가 계획을 세운다면?",
    optionA: { text: "새로운 곳으로 여행 떠나기 ✈️", type: "challenge" },
    optionB: { text: "집이나 호텔에서 푹 쉬기 🛋️", type: "stable" },
  },
  {
    id: 10,
    question: "2026년 연말, 내 모습은?",
    optionA: { text: "확실히 성장한 내 모습 📈", type: "realistic" },
    optionB: { text: "큰 탈 없이 평온한 상태 🧘", type: "free" },
  },
];


// const personalityResults: Record<PersonalityType, PersonalityResult> = {
//   stable: {
//     emoji: "🐢",
//     name: "안정형",
//     catchphrase: "2026년 목표: 큰 일 없이 무사히",
//     description:
//       "당신은 차분하고 신중한 타입이에요. 급격한 변화보다는 지금의 균형을 지키는 걸 더 중요하게 생각하죠. 괜히 흔들리기보단, 이미 잘 해오고 있는 걸 꾸준히 이어가는 스타일입니다.",
//     yearPreview:
//       "2026년의 당신은 조용하지만 단단한 한 해를 보내게 될 거예요. 눈에 띄는 변화는 적을 수 있지만, 정신없이 흔들리지 않고 자기 페이스를 잘 지켜나갈 수 있습니다. 남들보다 느려 보여도, 결국 가장 안정적인 길을 걷고 있어요.",
//     advice:
//       "평온함도 엄청난 능력이에요. 2026년, 지금처럼만 가도 충분히 잘하고 있어요 🙂",
//   },

//   challenge: {
//     emoji: "🚀",
//     name: "도전형",
//     catchphrase: "2026년은 안 해보면 손해",
//     description:
//       "당신은 생각보다 행동이 빠른 사람입니다. 새로운 기회가 보이면 일단 한 발 먼저 나가보는 스타일이죠. 실패보다는 ‘안 해본 것’을 더 아쉬워하는 편이에요.",
//     yearPreview:
//       "2026년은 당신에게 꽤 다이내믹한 해가 될 가능성이 커요. 새로운 시도, 새로운 선택들이 연달아 이어질 수 있어요. 가끔은 벅찰 수 있지만, 돌아보면 분명 ‘잘 질렀다’ 싶은 순간들이 남을 거예요.",
//     advice:
//       "속도도 좋지만, 브레이크도 중요해요. 가끔은 쉬어가도 괜찮아요 🚀",
//   },

//   realistic: {
//     emoji: "🐱",
//     name: "현실형",
//     catchphrase: "2026년에도 계획은 내 편",
//     description:
//       "당신은 상황을 꽤 냉정하게 보는 타입이에요. 감정에 휘둘리기보다는, 지금 나에게 뭐가 가장 유리한지를 잘 따집니다. 실속 없는 선택은 애초에 하지 않아요.",
//     yearPreview:
//       "2026년의 당신은 효율적으로 움직일 거예요. 불필요한 일에는 에너지를 쓰지 않고, 중요한 것만 콕 집어 챙기는 한 해가 될 가능성이 큽니다. 결과적으로 보면 가장 손해 없는 선택을 하고 있을지도 몰라요.",
//     advice:
//       "현실적인 판단은 차가운 게 아니라 똑똑한 거예요. 2026년도 계산 잘해봅시다 🐱",
//   },

//   free: {
//     emoji: "🦊",
//     name: "자유형",
//     catchphrase: "2026년은 기분 좋은 쪽으로",
//     description:
//       "당신은 틀에 맞추는 걸 별로 좋아하지 않는 편이에요. 그때그때 컨디션과 기분을 꽤 중요하게 생각하죠. 억지로 참고 버티는 것보다는, 스트레스를 줄이는 방법을 잘 알고 있어요.",
//     yearPreview:
//       "2026년의 당신은 가볍게 흘러가는 한 해를 보낼 가능성이 커요. 계획이 조금 느슨해 보여도, 그 안에서 나름의 균형을 잘 잡고 있을 거예요. 의외로 가장 오래 버티는 타입일지도 몰라요.",
//     advice:
//       "하고 싶은 걸 아는 것도 큰 재능이에요. 2026년은 너무 애쓰지 말아요 🦊",
//   },
// }

// 공유용 메시지 생성
export const createShareMessage = (
  type: PersonalityType,
  baseUrl: string
) => {
  const result = personalityResults[type];

  return {
    title: `2026 밸런스 게임 · ${result.name}`,
    text: `${result.emoji} ${result.catchphrase}

${result.yearPreview}

너의 2026년 타입은?
👉`,
    url: `${baseUrl}/result?type=${type}`,
  };
};

// export const metadata = {
//   title: "2026 밸런스 게임",
//   description: "당신의 2026년 성향을 알아보세요",
//   openGraph: {
//     title: "2026 밸런스 게임",
//     description: "2026년 나는 어떤 타입일까?",
//     images: [
//       {
//         url: "/public/stable.png",
//         width: 1200,
//         height: 630,
//         alt: "2026 밸런스 게임",
//       },
//     ],
//   },
// };

export default function NewYearBalanceGame() {

  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isComplete) return;

    const type = calculateResult();
    router.push(`/result?type=${type}`);
  }, [isComplete]);

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

  const storyRef = useRef<HTMLDivElement>(null);
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
      // 다시 숨기기
      storyRef.current.style.opacity = "0";
    }
  };

  
  const calculateResult = (): PersonalityType => {
    const scores: Record<PersonalityType, number> = {
      stable: 0,
      challenge: 0,
      realistic: 0,
      free: 0,
    }

    answers.forEach((answer) => {
      scores[answer.type]++
    })

    let maxScore = 0
    let resultType: PersonalityType = "stable"

    Object.entries(scores).forEach(([type, score]) => {
      if (score > maxScore) {
        maxScore = score
        resultType = type as PersonalityType
      }
    })

    return resultType
  }

  const handleChoice = (choice: "A" | "B") => {
    const selectedOption = choice === "A" ? currentQuestion.optionA : currentQuestion.optionB

    const newAnswer: Answer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selected: choice,
      option: selectedOption.text,
      type: selectedOption.type,
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsComplete(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestionIndex(0)
    setAnswers([])
    setIsComplete(false)
    setShowCopied(false)
  }

  const handleShare = async () => {
    if (!isComplete) return;
  
    const type = calculateResult(); // stable | challenge | ...
    const result = personalityResults[type];
  
    const url = window.location.href;
  
    const text = `${result.emoji} 나의 2026년 성향은 "${result.name}"!
  
  "${result.catchphrase}"
  
  너의 2026년은 어떤 타입일까? 👀`;
  
    if (navigator.share) {
      try {
        await navigator.share({
          title: "2026 신년 밸런스 게임",
          text,
          url,
        });
        return;
      } catch (err) {
        // 공유 취소 → 아래 복사 fallback
      }
    }
  
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };
  

  // 인스타 진입 감지
  const isInstagram = /Instagram/i.test(navigator.userAgent);

  const result = isComplete ? personalityResults[calculateResult()] : null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <Card className="w-full max-w-2xl p-8 md:p-12 relative z-10 border-2 shadow-lg">
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-primary" size={32} />
              <h1 className="text-4xl md:text-5xl font-bold text-primary">2026</h1>
              <Sparkles className="text-primary" size={32} />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-balance text-foreground">
              신년 밸런스 게임
            </h2>
            {/* <p className="text-muted-foreground text-pretty">
              새해를 맞아 가볍게 즐기는 밸런스 게임
            </p> */}
          </div>

          {/* 진행률 */}
          <div className="space-y-3">
        <div className="flex justify-between text-xs text-muted-foreground font-semibold uppercase tracking-wider">
          <span>Lv.{currentQuestionIndex + 1} 진행 중</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

          {/* 질문 */}
          <div className="text-center">
            <h3 className="font-semibold tracking-tight text-xl md:text-2xl font-medium text-balance leading-relaxed text-foreground">
              {currentQuestion.question}
            </h3>
          </div>

          {/* 선택 버튼 */}
          <div className="relative grid md:grid-cols-2 gap-4">{/* 간격을 조금 더 넓히면 시원해 보입니다 */}
  {/* 선택지 A: 차분한 민트 그레이 */}
  <Button
    onClick={() => handleChoice("A")}
    size="lg"
    className=" h-auto py-10 text-xl font-medium
    hover:scale-[1.05] active:scale-[0.95]
    transition-all duration-200
    text-slate-700
    shadow-sm hover:shadow-xl
    border-none"
    style={{ backgroundColor: "lab(88 -5.47 -5.21)" }}
  >
    {currentQuestion.optionA.text}
  </Button>
  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-full text-xs font-black text-slate-300 z-10 hidden md:block">
    VS
  </div>
  {/* 선택지 B: 따뜻한 베이지 */}
  <Button
    onClick={() => handleChoice("B")}
    size="lg"
    className="h-auto py-10 text-xl font-medium
    hover:scale-[1.05] active:scale-[0.95]
    transition-all duration-200
    text-slate-700
    shadow-sm hover:shadow-xl
    border-none"
    style={{ backgroundColor: "#edd9c4" }}           
  >
    {currentQuestion.optionB.text}
  </Button>
</div>
        </div>
      </Card>
    </div>
  )
}
