import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Trophy, 
  Star, 
  Zap, 
  Target, 
  Award, 
  TrendingUp,
  Calendar,
  Users,
  BookOpen,
  Code,
  Brain,
  Shield,
  Flame,
  Crown,
  Medal,
  Sparkles
} from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: "milestone" | "skill" | "streak" | "special";
  xpReward: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  unlockedAt?: string;
  progress?: {
    current: number;
    target: number;
  };
}

interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  deadline: string;
  difficulty: "easy" | "medium" | "hard";
  participants: number;
  completed: boolean;
  progress: number;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  level: number;
  streak: number;
  avatar?: string;
  isCurrentUser?: boolean;
}

export default function GamificationSystem() {
  const [activeTab, setActiveTab] = useState<"overview" | "achievements" | "challenges" | "leaderboard">("overview");
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Mock data - in real app would come from API
  const achievements: Achievement[] = [
    {
      id: "first-project",
      title: "First Steps",
      description: "Complete your first data science project",
      icon: "🎯",
      type: "milestone",
      xpReward: 100,
      rarity: "common",
      unlockedAt: "2025-01-30T10:00:00Z"
    },
    {
      id: "data-master",
      title: "Data Master",
      description: "Complete 10 data analysis projects",
      icon: "📊",
      type: "milestone",
      xpReward: 500,
      rarity: "rare",
      progress: { current: 7, target: 10 }
    },
    {
      id: "ml-expert",
      title: "ML Expert",
      description: "Train 25 machine learning models",
      icon: "🤖",
      type: "skill",
      xpReward: 750,
      rarity: "epic",
      progress: { current: 18, target: 25 }
    },
    {
      id: "streak-master",
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      icon: "🔥",
      type: "streak",
      xpReward: 1000,
      rarity: "legendary",
      progress: { current: 23, target: 30 }
    },
    {
      id: "community-star",
      title: "Community Star",
      description: "Receive 100 likes on forum posts",
      icon: "⭐",
      type: "special",
      xpReward: 300,
      rarity: "rare",
      progress: { current: 67, target: 100 }
    }
  ];

  const weeklyChallenges: WeeklyChallenge[] = [
    {
      id: "data-cleaning-sprint",
      title: "Data Cleaning Sprint",
      description: "Clean and prepare 3 different datasets this week",
      xpReward: 250,
      deadline: "2025-02-07T23:59:59Z",
      difficulty: "easy",
      participants: 1247,
      completed: true,
      progress: 100
    },
    {
      id: "visualization-master",
      title: "Visualization Master",
      description: "Create 5 different types of charts and visualizations",
      xpReward: 400,
      deadline: "2025-02-07T23:59:59Z",
      difficulty: "medium",
      participants: 856,
      completed: false,
      progress: 60
    },
    {
      id: "model-ensemble",
      title: "Ensemble Methods Challenge",
      description: "Build and compare 3 ensemble models",
      xpReward: 600,
      deadline: "2025-02-07T23:59:59Z",
      difficulty: "hard",
      participants: 234,
      completed: false,
      progress: 33
    }
  ];

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: "DataNinja", xp: 15420, level: 24, streak: 45 },
    { rank: 2, username: "MLMaster", xp: 14876, level: 23, streak: 32 },
    { rank: 3, username: "AnalyticsAce", xp: 13945, level: 22, streak: 28 },
    { rank: 4, username: "johnsmith", xp: user?.xp || 3250, level: user?.level || 8, streak: 23, isCurrentUser: true },
    { rank: 5, username: "DataScientist", xp: 12654, level: 21, streak: 19 },
    { rank: 6, username: "PythonPro", xp: 11987, level: 20, streak: 15 },
    { rank: 7, username: "StatsGuru", xp: 11234, level: 19, streak: 12 }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-800 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-800 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-800 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-800 border-yellow-300";
      default: return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTimeUntilDeadline = (deadline: string) => {
    const now = new Date();
    const target = new Date(deadline);
    const diff = target.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    return `${hours}h`;
  };

  const currentLevel = user?.level || 1;
  const currentXP = user?.xp || 0;
  const xpForNextLevel = currentLevel * 1000;
  const xpProgress = ((currentXP % 1000) / 1000) * 100;

  return (
    <div className="space-y-6">
      {/* User Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Level {currentLevel} Data Scientist</h3>
                <p className="text-gray-600">{currentXP.toLocaleString()} XP • Next level in {xpForNextLevel - (currentXP % 1000)} XP</p>
                <Progress value={xpProgress} className="w-48 mt-2" />
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">23</div>
                  <div className="text-sm text-gray-600">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Achievements</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">#4</div>
                  <div className="text-sm text-gray-600">Leaderboard</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: "overview", label: "Overview", icon: TrendingUp },
          { id: "achievements", label: "Achievements", icon: Trophy },
          { id: "challenges", label: "Challenges", icon: Target },
          { id: "leaderboard", label: "Leaderboard", icon: Crown }
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === id
                ? "bg-white text-primary shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {achievements.filter(a => a.unlockedAt).slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{achievement.title}</p>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge className={getRarityColor(achievement.rarity)}>
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Flame className="w-5 h-5" />
                Active Challenges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weeklyChallenges.filter(c => !c.completed).slice(0, 3).map((challenge) => (
                  <div key={challenge.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-sm">{challenge.title}</p>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <Progress value={challenge.progress} className="mb-2" />
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span>{challenge.progress}% complete</span>
                      <span>{getTimeUntilDeadline(challenge.deadline)} left</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => (
            <Card key={achievement.id} className={`${achievement.unlockedAt ? 'border-primary/30 bg-primary/5' : 'opacity-75'}`}>
              <CardContent className="py-4">
                <div className="text-center space-y-3">
                  <div className="text-4xl mx-auto">{achievement.icon}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Badge className={getRarityColor(achievement.rarity)}>
                      {achievement.rarity}
                    </Badge>
                    <Badge variant="secondary">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                  {achievement.progress && (
                    <div className="space-y-2">
                      <Progress value={(achievement.progress.current / achievement.progress.target) * 100} />
                      <p className="text-xs text-gray-600">
                        {achievement.progress.current} / {achievement.progress.target}
                      </p>
                    </div>
                  )}
                  {achievement.unlockedAt && (
                    <Badge className="bg-green-100 text-green-800">
                      <Star className="w-3 h-3 mr-1" />
                      Unlocked!
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "challenges" && (
        <div className="space-y-4">
          {weeklyChallenges.map((challenge) => (
            <Card key={challenge.id} className={challenge.completed ? "bg-green-50 border-green-200" : ""}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900">{challenge.title}</h3>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                      {challenge.completed && (
                        <Badge className="bg-green-100 text-green-800">
                          <Star className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                    
                    <div className="space-y-2">
                      <Progress value={challenge.progress} />
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{challenge.progress}% complete</span>
                        <span>{challenge.participants.toLocaleString()} participants</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="text-lg font-bold text-primary">+{challenge.xpReward} XP</div>
                    <div className="text-xs text-gray-600">{getTimeUntilDeadline(challenge.deadline)} left</div>
                    {!challenge.completed && (
                      <Button size="sm" className="mt-2">
                        Continue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {activeTab === "leaderboard" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5" />
              Global Leaderboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {leaderboard.map((entry) => (
                <div key={entry.username} className={`flex items-center justify-between p-4 rounded-lg ${
                  entry.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-gray-50"
                }`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      entry.rank === 1 ? "bg-yellow-100 text-yellow-800" :
                      entry.rank === 2 ? "bg-gray-100 text-gray-800" :
                      entry.rank === 3 ? "bg-orange-100 text-orange-800" :
                      "bg-blue-100 text-blue-800"
                    }`}>
                      {entry.rank <= 3 ? (
                        entry.rank === 1 ? "🥇" : entry.rank === 2 ? "🥈" : "🥉"
                      ) : (
                        entry.rank
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${entry.isCurrentUser ? "text-primary" : "text-gray-900"}`}>
                        {entry.username} {entry.isCurrentUser && "(You)"}
                      </p>
                      <p className="text-sm text-gray-600">Level {entry.level} • {entry.streak} day streak</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">{entry.xp.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">XP</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}