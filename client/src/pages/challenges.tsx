import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Zap, 
  Trophy, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  Code, 
  Database, 
  BarChart3,
  Brain,
  Star
} from "lucide-react";

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: "data_cleaning" | "visualization" | "modeling" | "analysis";
  xp: number;
  timeLimit: number; // minutes
  status: "available" | "in_progress" | "completed" | "locked";
  completionRate: number;
}

export default function Challenges() {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const challenges: Challenge[] = [
    {
      id: "clean-messy-data",
      title: "Clean the Messy Dataset",
      description: "Fix missing values, remove duplicates, and handle outliers in a customer dataset with 20% data quality issues.",
      difficulty: "beginner",
      category: "data_cleaning",
      xp: 150,
      timeLimit: 30,
      status: "available",
      completionRate: 0,
    },
    {
      id: "broken-model-fix",
      title: "Debug the Broken Model",
      description: "A Random Forest model is performing poorly (45% accuracy). Identify and fix the issues causing underfitting.",
      difficulty: "intermediate",
      category: "modeling",
      xp: 250,
      timeLimit: 45,
      status: "available",
      completionRate: 0,
    },
    {
      id: "correlation-detective",
      title: "Correlation Detective",
      description: "Find hidden relationships in a multi-dimensional dataset and create meaningful visualizations.",
      difficulty: "intermediate",
      category: "visualization",
      xp: 200,
      timeLimit: 60,
      status: "completed",
      completionRate: 100,
    },
    {
      id: "feature-engineering-master",
      title: "Feature Engineering Master",
      description: "Transform raw transaction data into predictive features for fraud detection. Create at least 15 meaningful features.",
      difficulty: "advanced",
      category: "analysis",
      xp: 400,
      timeLimit: 90,
      status: "locked",
      completionRate: 0,
    },
    {
      id: "sql-performance-optimization",
      title: "SQL Performance Wizard",
      description: "Optimize slow-running queries processing 1M+ records. Reduce execution time by 80%.",
      difficulty: "advanced",
      category: "data_cleaning",
      xp: 350,
      timeLimit: 75,
      status: "available",
      completionRate: 0,
    },
    {
      id: "visualization-storytelling",
      title: "Data Storytelling Champion",
      description: "Create a compelling business presentation using only charts and visualizations. No text allowed!",
      difficulty: "intermediate",
      category: "visualization",
      xp: 300,
      timeLimit: 50,
      status: "in_progress",
      completionRate: 35,
    },
  ];

  const startChallengeMutation = useMutation({
    mutationFn: async (challengeId: string) => {
      const response = await apiRequest("POST", `/api/challenges/${challengeId}/start`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const categories = [
    { id: "all", label: "All Challenges", icon: Target },
    { id: "data_cleaning", label: "Data Cleaning", icon: Database },
    { id: "visualization", label: "Visualization", icon: BarChart3 },
    { id: "modeling", label: "ML Modeling", icon: Brain },
    { id: "analysis", label: "Analysis", icon: Code },
  ];

  const filteredChallenges = activeCategory === "all" 
    ? challenges 
    : challenges.filter(c => c.category === activeCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "in_progress": return <Clock className="w-5 h-5 text-yellow-500" />;
      case "locked": return <AlertTriangle className="w-5 h-5 text-gray-400" />;
      default: return <Target className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "data_cleaning": return <Database className="w-4 h-4" />;
      case "visualization": return <BarChart3 className="w-4 h-4" />;
      case "modeling": return <Brain className="w-4 h-4" />;
      case "analysis": return <Code className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Micro-Challenges</h1>
              <p className="text-gray-600 mt-2">Level up your skills with hands-on challenges</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-2 rounded-full border border-amber-200">
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-medium text-amber-700">
                    {challenges.filter(c => c.status === "completed").length}/{challenges.length} Completed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon;
                    const categoryCount = category.id === "all" 
                      ? challenges.length 
                      : challenges.filter(c => c.category === category.id).length;
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          activeCategory === category.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{category.label}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {categoryCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Challenge Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Progress</span>
                      <span>{Math.round((challenges.filter(c => c.status === "completed").length / challenges.length) * 100)}%</span>
                    </div>
                    <Progress value={(challenges.filter(c => c.status === "completed").length / challenges.length) * 100} className="h-2" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completed</span>
                      <span className="font-medium">{challenges.filter(c => c.status === "completed").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">In Progress</span>
                      <span className="font-medium">{challenges.filter(c => c.status === "in_progress").length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total XP Earned</span>
                      <span className="font-medium text-primary">
                        {challenges.filter(c => c.status === "completed").reduce((sum, c) => sum + c.xp, 0)} XP
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Challenges Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredChallenges.map((challenge) => (
                <Card key={challenge.id} className={`overflow-hidden ${challenge.status === "locked" ? "opacity-60" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(challenge.status)}
                        <Badge className={getDifficultyColor(challenge.difficulty)}>
                          {challenge.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(challenge.category)}
                        <span className="text-xs text-gray-500 capitalize">
                          {challenge.category.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>
                    
                    {challenge.status === "in_progress" && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{challenge.completionRate}%</span>
                        </div>
                        <Progress value={challenge.completionRate} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-amber-500" />
                          <span className="text-sm font-medium">{challenge.xp} XP</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{challenge.timeLimit} min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {challenge.status === "available" && (
                        <Button 
                          className="flex-1"
                          onClick={() => startChallengeMutation.mutate(challenge.id)}
                          disabled={startChallengeMutation.isPending}
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Start Challenge
                        </Button>
                      )}
                      
                      {challenge.status === "in_progress" && (
                        <Button className="flex-1" variant="outline">
                          <Clock className="w-4 h-4 mr-2" />
                          Continue
                        </Button>
                      )}
                      
                      {challenge.status === "completed" && (
                        <Button className="flex-1" variant="outline" disabled>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Completed
                        </Button>
                      )}
                      
                      {challenge.status === "locked" && (
                        <Button className="flex-1" variant="outline" disabled>
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Locked
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}