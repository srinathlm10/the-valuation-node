import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { quizService, Quiz as IQuiz } from "@/services/quizService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle, Trophy, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";

interface QuizProps {
    articleId: string;
}

export function Quiz({ articleId }: QuizProps) {
    const { toast } = useToast();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [showExplanation, setShowExplanation] = useState(false);

    // Fetch Quiz
    const { data: quiz, isLoading } = useQuery({
        queryKey: ['quiz', articleId],
        queryFn: () => quizService.getQuizByArticleId(articleId),
        retry: false
    });

    // Fetch Previous Attempt
    const { data: previousAttempt } = useQuery({
        queryKey: ['quizAttempt', quiz?.id],
        queryFn: () => quiz?.id ? quizService.getPreviousAttempt(quiz.id) : null,
        enabled: !!quiz?.id
    });

    if (isLoading) return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>;
    if (!quiz) return null; // No quiz for this article

    const questions = quiz.questions || [];
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const progress = ((currentQuestionIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100;

    const handleOptionSelect = (value: string) => {
        if (isSubmitted) return;
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: parseInt(value)
        }));
        setShowExplanation(false);
    };

    const handleNext = () => {
        setShowExplanation(false); // Hide explanation from previous question if any (though logic below changes flow)
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            submitQuiz();
        }
    };

    const submitQuiz = async () => {
        let calculatedScore = 0;
        questions.forEach(q => {
            if (selectedAnswers[q.id] === q.correct_answer_index) {
                calculatedScore++;
            }
        });

        setScore(calculatedScore);
        setIsSubmitted(true);

        // Save attempt
        await quizService.submitQuizAttempt(quiz.id, calculatedScore, questions.length);

        if (calculatedScore / questions.length >= 0.7) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
            toast({
                title: "Quiz Passed! 🎉",
                description: `You scored ${calculatedScore}/${questions.length}. Great job!`,
            });
        } else {
            toast({
                title: "Nice Try!",
                description: `You scored ${calculatedScore}/${questions.length}. Review the article and try again!`,
                variant: "destructive"
            });
        }
    };

    const isCorrect = (questionId: string) => {
        const question = questions.find(q => q.id === questionId);
        return selectedAnswers[questionId] === question?.correct_answer_index;
    };

    if (isSubmitted) {
        return (
            <Card className="mt-8 border-2 border-primary/10">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                        {score / questions.length >= 0.7 ? <Trophy className="h-8 w-8 text-yellow-500" /> : <AlertCircle className="h-8 w-8 text-muted-foreground" />}
                        Quiz Results
                    </CardTitle>
                    <CardDescription>
                        You scored <span className="font-bold text-foreground text-lg">{score} / {questions.length}</span>
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {questions.map((q, idx) => (
                            <div key={q.id} className="p-4 rounded-lg bg-muted/50 text-left">
                                <div className="flex items-start gap-2 mb-2">
                                    <span className="font-mono text-xs text-muted-foreground mt-1">{idx + 1}.</span>
                                    <p className="font-medium text-sm">{q.question}</p>
                                </div>
                                <div className="pl-6 space-y-2">
                                    <div className={cn(
                                        "text-sm p-2 rounded flex items-center gap-2",
                                        selectedAnswers[q.id] === q.correct_answer_index
                                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                    )}>
                                        {selectedAnswers[q.id] === q.correct_answer_index ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                        Your Answer: {q.options[selectedAnswers[q.id]]}
                                    </div>
                                    {selectedAnswers[q.id] !== q.correct_answer_index && (
                                        <div className="text-sm p-2 rounded bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 flex items-center gap-2">
                                            <CheckCircle2 className="h-4 w-4" />
                                            Correct Answer: {q.options[q.correct_answer_index]}
                                        </div>
                                    )}
                                    {q.explanation && (
                                        <p className="text-xs text-muted-foreground italic mt-2">💡 {q.explanation}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="justify-center">
                    <Button onClick={() => {
                        setIsSubmitted(false);
                        setCurrentQuestionIndex(0);
                        setSelectedAnswers({});
                        setScore(0);
                    }}>Retake Quiz</Button>
                </CardFooter>
            </Card>
        )
    }

    return (
        <div className="mt-12 not-prose">
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                            Quiz
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <Progress value={progress} className="h-2 mb-4" />
                    <CardTitle className="text-xl">{quiz.title}</CardTitle>
                    <CardDescription>{quiz.description}</CardDescription>
                </CardHeader>

                <CardContent>
                    <div className="space-y-6">
                        <h3 className="text-lg font-medium">{currentQuestion.question}</h3>

                        <RadioGroup
                            value={selectedAnswers[currentQuestion.id]?.toString()}
                            onValueChange={handleOptionSelect}
                            className="space-y-3"
                        >
                            {currentQuestion.options.map((option, index) => (
                                <div key={index} className={cn(
                                    "flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer",
                                    selectedAnswers[currentQuestion.id] === index && "border-primary bg-primary/5"
                                )}>
                                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                    <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer font-normal">
                                        {option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>
                    <Button
                        onClick={handleNext}
                        disabled={selectedAnswers[currentQuestion.id] === undefined}
                    >
                        {isLastQuestion ? "Submit Quiz" : "Next Question"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
