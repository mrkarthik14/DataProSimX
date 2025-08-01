import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { 
  Zap, 
  Clock, 
  Star, 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Play,
  Pause,
  RotateCcw 
} from "lucide-react";

interface MicroChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  timeLimit: number; // in minutes
  xpReward: number;
  hints: string[];
  expectedAnswer?: string;
  validationCriteria: string[];
}

interface MicroChallengeProps {
  userLevel?: number;
  skillArea?: string;
  datasetInfo?: any;
  onChallengeComplete?: (xp: number) => void;
}

export default function MicroChallenges({ 
  userLevel = 1, 
  skillArea = "data_analysis",
  datasetInfo,
  onChallengeComplete 
}: MicroChallengeProps) {
  const [currentChallenge, setCurrentChallenge] = useState<MicroChallenge | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answer, setAnswer] = useState("");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isActive && timeLeft > 0 && !isCompleted) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            setIsSuccess(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (!isActive) {
      if (interval) clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, isCompleted]);

  const generateChallengeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/ai/challenge", {
        userLevel,
        skillArea,
        datasetInfo,
        completedChallenges: []
      });
      return response.json();
    },
    onSuccess: (challenge: MicroChallenge) => {
      setCurrentChallenge(challenge);
      setTimeLeft(challenge.timeLimit * 60); // Convert to seconds
      setIsActive(false);
      setIsCompleted(false);
      setIsSuccess(false);
      setAnswer("");
      setHintsUsed(0);
    }
  });

  const startChallenge = () => {
    setIsActive(true);
  };

  const pauseChallenge = () => {
    setIsActive(false);
  };

  const submitAnswer = () => {
    if (!currentChallenge || !answer.trim()) return;

    // Simple validation (in real app, this would be more sophisticated)
    const isCorrect = answer.trim().length > 10; // Basic check
    
    setIsCompleted(true);
    setIsSuccess(isCorrect);
    setIsActive(false);

    if (isCorrect) {
      // Calculate XP based on performance
      const timeBonus = Math.max(0, (timeLeft / (currentChallenge.timeLimit * 60)) * 20);
      const hintPenalty = hintsUsed * 5;
      const finalXP = Math.round(currentChallenge.xpReward + timeBonus - hintPenalty);
      
      onChallengeComplete?.(finalXP);
    }
  };

  const resetChallenge = () => {
    if (currentChallenge) {
      setTimeLeft(currentChallenge.timeLimit * 60);
      setIsActive(false);
      setIsCompleted(false);
      setIsSuccess(false);
      setAnswer("");
      setHintsUsed(0);
    }
  };

  const useHint = () => {
    setHintsUsed(prev => Math.min(prev + 1, currentChallenge?.hints.length || 0));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBloomColor = (level: string) => {
    const colors = {
      remember: 'bg-blue-100 text-blue-800',
      understand: 'bg-purple-100 text-purple-800',
      apply: 'bg-green-100 text-green-800',
      analyze: 'bg-orange-100 text-orange-800',
      evaluate: 'bg-red-100 text-red-800',
      create: 'bg-pink-100 text-pink-800'
    };
    return colors[level as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-blue-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Zap className="w-5 h-5 mr-2 text-purple-600" />
            Micro-Challenge
          </div>
          {!currentChallenge && (
            <Button 
              onClick={() => generateChallengeMutation.mutate()}
              disabled={generateChallengeMutation.isPending}
            >
              {generateChallengeMutation.isPending ? "Generating..." : "New Challenge"}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {generateChallengeMutation.isPending ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
            <span className="ml-2 text-purple-600">Creating personalized challenge...</span>
          </div>
        ) : currentChallenge ? (
          <div className="space-y-4">
            {/* Challenge Header */}
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{currentChallenge.title}</h3>
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(currentChallenge.difficulty)}>
                  {currentChallenge.difficulty}
                </Badge>
                <Badge className={getBloomColor(currentChallenge.bloomLevel)}>
                  {currentChallenge.bloomLevel}
                </Badge>
                <Badge variant="outline" className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {currentChallenge.xpReward} XP
                </Badge>
              </div>
            </div>

            {/* Timer and Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className={`font-mono text-lg ${timeLeft < 60 ? 'text-red-600' : 'text-gray-700'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {!isCompleted && (
                    <>
                      {!isActive ? (
                        <Button size="sm" onClick={startChallenge}>
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={pauseChallenge}>
                          <Pause className="w-4 h-4 mr-1" />
                          Pause
                        </Button>
                      )}
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={resetChallenge}>
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                </div>
              </div>
              <Progress 
                value={((currentChallenge.timeLimit * 60 - timeLeft) / (currentChallenge.timeLimit * 60)) * 100}
                className="h-2"
              />
            </div>

            {/* Challenge Description */}
            <div className="bg-white border rounded-lg p-4">
              <p className="text-gray-700">{currentChallenge.description}</p>
            </div>

            {/* Hints */}
            {currentChallenge.hints.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hints Available:</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={useHint}
                    disabled={hintsUsed >= currentChallenge.hints.length || isCompleted}
                  >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Use Hint ({hintsUsed}/{currentChallenge.hints.length})
                  </Button>
                </div>
                {hintsUsed > 0 && (
                  <div className="space-y-1">
                    {currentChallenge.hints.slice(0, hintsUsed).map((hint, index) => (
                      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-2 text-sm">
                        <strong>Hint {index + 1}:</strong> {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Answer Input */}
            {!isCompleted ? (
              <div className="space-y-2">
                <label className="font-medium">Your Answer:</label>
                <Textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Describe your approach, findings, or solution..."
                  className="min-h-[100px]"
                  disabled={!isActive}
                />
                <Button 
                  onClick={submitAnswer}
                  disabled={!answer.trim() || !isActive}
                  className="w-full"
                >
                  Submit Answer
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Results */}
                <div className={`border rounded-lg p-4 ${
                  isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                }`}>
                  <div className="flex items-center space-x-2 mb-2">
                    {isSuccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-semibold ${
                      isSuccess ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {isSuccess ? 'Challenge Completed!' : 'Challenge Failed'}
                    </span>
                  </div>
                  {isSuccess && (
                    <p className="text-green-700">
                      Great work! You've earned {currentChallenge.xpReward} XP.
                    </p>
                  )}
                </div>

                {/* Expected Answer */}
                {currentChallenge.expectedAnswer && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-800 mb-2">Expected Approach:</h4>
                    <p className="text-blue-700 text-sm">{currentChallenge.expectedAnswer}</p>
                  </div>
                )}

                {/* New Challenge Button */}
                <Button 
                  onClick={() => generateChallengeMutation.mutate()}
                  disabled={generateChallengeMutation.isPending}
                  className="w-full"
                >
                  Try Another Challenge
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Zap className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <h3 className="font-semibold text-lg mb-2">Ready for a Challenge?</h3>
            <p className="text-gray-600 mb-4">
              Test your skills with AI-generated micro-challenges tailored to your level
            </p>
            <Button 
              onClick={() => generateChallengeMutation.mutate()}
              disabled={generateChallengeMutation.isPending}
            >
              Generate Challenge
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}