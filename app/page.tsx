"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Share2, LinkIcon } from "lucide-react"

import { useRef } from "react";
import * as htmlToImage from "html-to-image";

type PersonalityType = "stable" | "challenge" | "realistic" | "free"

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
    question: "2026년에 진짜로 더 바라는 건?",
    optionA: {
      text: "통장 두둑 💰",
      type: "challenge",
    },
    optionB: {
      text: "삶의 여유 🛌",
      type: "stable",
    },
  },
  {
    id: 2,
    question: "새해 첫 출근 날 내 상태는?",
    optionA: {
      text: "올해는 다르다 🔥",
      type: "challenge",
    },
    optionB: {
      text: "이미 지침 😇",
      type: "free",
    },
  },
  {
    id: 3,
    question: "점심 메뉴 고를 때 나는?",
    optionA: {
      text: "오늘은 뭘 먹을까 🤔",
      type: "free",
    },
    optionB: {
      text: "늘 먹던 걸로 🍱",
      type: "realistic",
    },
  },
  {
    id: 4,
    question: "일정 잡을 때 더 좋은 건?",
    optionA: {
      text: "빨리 끝내고 자유 🌅",
      type: "realistic",
    },
    optionB: {
      text: "여유 있게 진행 🌙",
      type: "free",
    },
  },
  {
    id: 5,
    question: "누군가 부탁했을 때 나는?",
    optionA: {
      text: "꼼꼼히 챙겨주는 편 🙋",
      type: "stable",
    },
    optionB: {
      text: "쿨하게 OK 👍",
      type: "free",
    },
  },
  {
    id: 6,
    question: "문제가 생기면 나는?",
    optionA: {
      text: "지금 당장 해결 💥",
      type: "challenge",
    },
    optionB: {
      text: "차분히 정리부터 📝",
      type: "stable",
    },
  },
  {
    id: 7,
    question: "퇴근 후 진짜 힐링은?",
    optionA: {
      text: "움직여야 풀린다 🏃",
      type: "challenge",
    },
    optionB: {
      text: "아무것도 안 하기 😴",
      type: "stable",
    },
  },
  {
    id: 8,
    question: "새로운 걸 시작할 때 나는?",
    optionA: {
      text: "정보부터 싹 정리 📚",
      type: "realistic",
    },
    optionB: {
      text: "일단 해보자 💻",
      type: "challenge",
    },
  },
  {
    id: 9,
    question: "올해 휴가/쉬는 날 계획은?",
    optionA: {
      text: "어디든 떠난다 ✈️",
      type: "challenge",
    },
    optionB: {
      text: "집이 최고 🛋️",
      type: "stable",
    },
  },
  {
    id: 10,
    question: "2026년 나에게 가장 중요한 건?",
    optionA: {
      text: "성장과 성취 📈",
      type: "realistic",
    },
    optionB: {
      text: "마음의 평화 🧘",
      type: "free",
    },
  },
]


const personalityResults: Record<PersonalityType, PersonalityResult> = {
  stable: {
    emoji: "🐢",
    name: "안정형",
    catchphrase: "2026년 목표: 큰 일 없이 무사히",
    description:
      "당신은 차분하고 신중한 타입이에요. 급격한 변화보다는 지금의 균형을 지키는 걸 더 중요하게 생각하죠. 괜히 흔들리기보단, 이미 잘 해오고 있는 걸 꾸준히 이어가는 스타일입니다.",
    yearPreview:
      "2026년의 당신은 조용하지만 단단한 한 해를 보내게 될 거예요. 눈에 띄는 변화는 적을 수 있지만, 정신없이 흔들리지 않고 자기 페이스를 잘 지켜나갈 수 있습니다. 남들보다 느려 보여도, 결국 가장 안정적인 길을 걷고 있어요.",
    advice:
      "평온함도 엄청난 능력이에요. 2026년, 지금처럼만 가도 충분히 잘하고 있어요 🙂",
  },

  challenge: {
    emoji: "🚀",
    name: "도전형",
    catchphrase: "2026년은 안 해보면 손해",
    description:
      "당신은 생각보다 행동이 빠른 사람입니다. 새로운 기회가 보이면 일단 한 발 먼저 나가보는 스타일이죠. 실패보다는 ‘안 해본 것’을 더 아쉬워하는 편이에요.",
    yearPreview:
      "2026년은 당신에게 꽤 다이내믹한 해가 될 가능성이 커요. 새로운 시도, 새로운 선택들이 연달아 이어질 수 있어요. 가끔은 벅찰 수 있지만, 돌아보면 분명 ‘잘 질렀다’ 싶은 순간들이 남을 거예요.",
    advice:
      "속도도 좋지만, 브레이크도 중요해요. 가끔은 쉬어가도 괜찮아요 🚀",
  },

  realistic: {
    emoji: "🐱",
    name: "현실형",
    catchphrase: "2026년에도 계획은 내 편",
    description:
      "당신은 상황을 꽤 냉정하게 보는 타입이에요. 감정에 휘둘리기보다는, 지금 나에게 뭐가 가장 유리한지를 잘 따집니다. 실속 없는 선택은 애초에 하지 않아요.",
    yearPreview:
      "2026년의 당신은 효율적으로 움직일 거예요. 불필요한 일에는 에너지를 쓰지 않고, 중요한 것만 콕 집어 챙기는 한 해가 될 가능성이 큽니다. 결과적으로 보면 가장 손해 없는 선택을 하고 있을지도 몰라요.",
    advice:
      "현실적인 판단은 차가운 게 아니라 똑똑한 거예요. 2026년도 계산 잘해봅시다 🐱",
  },

  free: {
    emoji: "🦊",
    name: "자유형",
    catchphrase: "2026년은 기분 좋은 쪽으로",
    description:
      "당신은 틀에 맞추는 걸 별로 좋아하지 않는 편이에요. 그때그때 컨디션과 기분을 꽤 중요하게 생각하죠. 억지로 참고 버티는 것보다는, 스트레스를 줄이는 방법을 잘 알고 있어요.",
    yearPreview:
      "2026년의 당신은 가볍게 흘러가는 한 해를 보낼 가능성이 커요. 계획이 조금 느슨해 보여도, 그 안에서 나름의 균형을 잘 잡고 있을 거예요. 의외로 가장 오래 버티는 타입일지도 몰라요.",
    advice:
      "하고 싶은 걸 아는 것도 큰 재능이에요. 2026년은 너무 애쓰지 말아요 🦊",
  },
}


export default function NewYearBalanceGame() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isComplete, setIsComplete] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  const resultRef = useRef<HTMLDivElement>(null);

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
    const url = window.location.href
    const resultType = isComplete ? personalityResults[calculateResult()].name : ""
    const text = `나의 2026년 성향은 "${resultType}"! 🎉\n새해를 맞아 가볍게 즐기는 밸런스 게임`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "2026 신년 밸런스 게임",
          text: text,
          url: url,
        })
        return
      } catch (err) {
        // User cancelled or error occurred, fall back to copy
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`)
      setShowCopied(true)
      setTimeout(() => setShowCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const result = isComplete ? personalityResults[calculateResult()] : null

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Sparkles
          className="absolute top-10 left-10 text-primary/60 sparkle"
          size={24}
          style={{ animationDelay: "0s" }}
        />
        <Sparkles
          className="absolute top-20 right-20 text-accent/60 sparkle"
          size={20}
          style={{ animationDelay: "0.5s" }}
        />
        <Sparkles
          className="absolute bottom-32 left-1/4 text-primary/60 sparkle"
          size={28}
          style={{ animationDelay: "1s" }}
        />
        <Sparkles
          className="absolute bottom-20 right-1/3 text-accent/60 sparkle"
          size={22}
          style={{ animationDelay: "1.5s" }}
        />
        <Sparkles
          className="absolute top-1/2 right-10 text-primary/60 sparkle"
          size={26}
          style={{ animationDelay: "2s" }}
        />
        <Sparkles
          className="absolute top-1/3 left-1/3 text-accent/60 sparkle"
          size={18}
          style={{ animationDelay: "2.5s" }}
        />
      </div>

      <Card className="w-full max-w-2xl p-8 md:p-12 relative z-10 border-2 shadow-lg">
        {!isComplete ? (
          <div className="space-y-8">
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="text-primary" size={32} />
                <h1 className="text-4xl md:text-5xl font-bold text-primary">2026</h1>
                <Sparkles className="text-primary" size={32} />
              </div>
              <h2 className="text-2xl md:text-3xl font-semibold text-balance text-foreground">신년 밸런스 게임</h2>
              <p className="text-muted-foreground text-pretty">새해를 맞아 가볍게 즐기는 밸런스 게임</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground font-medium">
                <span>
                  질문 {currentQuestionIndex + 1} / {questions.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 bg-secondary rounded-full overflow-hidden border border-border">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
{/* 수정  기존 : <div className="text-center py-6"> */}
            <div className="text-center">
              <h3 className="text-xl md:text-2xl font-medium text-balance leading-relaxed text-foreground">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Button
                onClick={() => handleChoice("A")}
                size="lg"
                className="h-auto py-8 text-lg font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg"
                style={{
                 
                  backgroundColor: "rgb(190 224 234)" ,/* 현재보다 채도 -10~15% */
                  color: "#1f2933"
                }}
              >
                <div className="space-y-2">
                  
                  <div className="text-pretty"
                  style={{
                    
                    fontWeight: 600,
                    fontSize: "18px",
                    border : "0px"
                  }}
                  >{currentQuestion.optionA.text}</div>
                </div>
              </Button>
              <Button
                onClick={() => handleChoice("B")}
                size="lg"
                variant="outline"
                className="h-auto py-8 text-lg font-medium hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border-2 border-accent bg-white hover:bg-accent/10 text-foreground shadow-md hover:shadow-lg"
                style={{
                  backgroundColor : "#f9e8d7",
                  fontWeight: 600,
                  fontSize: "18px",
             border : "none" 
                }}
              
              >
                <div className="space-y-2">
              
                  <div className="text-pretty"
                  style={{
                    fontWeight: 600,
                    fontSize: "18px",
                    
                  }}>{currentQuestion.optionB.text}</div>
                </div>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Sparkles className="text-primary" size={28} />
                <h2 className="text-2xl md:text-3xl font-bold text-primary">2026 신년 성향 테스트</h2>
                <Sparkles className="text-primary" size={28} />
              </div>
              <p className="text-muted-foreground text-lg">당신의 2026년 성향은...</p>
            </div>

            {result && (
              <>
              <div ref={resultRef} >

                <div className="space-y-6">
                  <div className="text-center p-8 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 rounded-2xl border-2 border-primary/30 space-y-4 shadow-lg">
                    <div className="text-7xl mb-2">{result.emoji}</div>
                    <h3 className="text-3xl md:text-4xl font-bold text-foreground">{result.name}</h3>
                    <p className="text-xl md:text-2xl font-medium text-primary text-balance italic">
                      "{result.catchphrase}"
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-6 bg-secondary rounded-xl space-y-3 border border-border">
                      <h4 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <span className="text-2xl">{result.emoji}</span>
                        <span>성향 분석</span>
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
                      <p className="text-center text-lg font-medium text-balance leading-relaxed text-foreground">
                        {result.advice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              {/* 스토리 저장 전용 */} 
              <div ref={storyRef} 
              className="fixed top-0 left-0 w-[1080px] h-[1920px] opacity-0 pointer-events-none bg-gradient-to-br from-primary/20 via-accent/10 to-primary/10 flex items-center justify-center" >
                 <div className="w-[860px] rounded-3xl bg-white p-14 text-center shadow-xl space-y-8"> 
                 <div className="text-8xl">{result.emoji}</div> 
                 <h3 className="text-5xl font-bold text-foreground"> {result.name} </h3> 
                 <p className="text-2xl font-medium text-primary italic"> “{result.catchphrase}” </p> 
                 <p className="text-xl text-foreground/80 leading-relaxed line-clamp-5"> {result.yearPreview} </p> 
                 <div className="pt-8 text-sm text-foreground/40"> @2026_nov</div> 
                 </div> </div>
              </>
            )}

            <div className="flex flex-col gap-3 justify-center pt-4">
              {/* <Button
                onClick={handleShare}
                size="lg"
                variant="outline"
                className="px-8 text-lg border-2 border-primary bg-white hover:bg-primary/10 text-foreground font-medium shadow-md hover:shadow-lg transition-all relative"
              >
                {showCopied ? (
                  <>
                    <LinkIcon className="mr-2" size={20} />
                    링크 복사됨!
                  </>
                ) : (
                  <>
                    <Share2 className="mr-2" size={20} />
                    공유하기
                  </>
                )}
              </Button> */}
              <button
                onClick={saveStoryImage}
                className="mt-6 rounded-xl bg-black px-4 py-2 text-white"
              >
                📸 결과 이미지 저장
              </button>
              <Button
                onClick={handleRestart}
                size="lg"
                className="px-8 text-lg bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Sparkles className="mr-2" size={20} />
                다시 하기
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
