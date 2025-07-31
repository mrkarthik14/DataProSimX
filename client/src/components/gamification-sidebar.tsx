import { User } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Zap, Fan, BarChart3, Brain } from "lucide-react";

interface GamificationSidebarProps {
  user?: User;
}

export default function GamificationSidebar({ user }: GamificationSidebarProps) {
  const nextLevelXp = ((user?.level || 1) + 1) * 1000;
  const currentLevelXp = (user?.level || 1) * 1000;
  const progressToNextLevel = ((user?.xp || 0) - currentLevelXp) / (nextLevelXp - currentLevelXp) * 100;

  const badges = [
    {
      icon: Fan,
      title: "Data Janitor",
      description: "Cleaned 5 datasets",
      color: "from-amber-400 to-orange-500",
    },
    {
      icon: BarChart3,
      title: "Viz Master", 
      description: "Created 10 visualizations",
      color: "from-blue-400 to-blue-600",
    },
    {
      icon: Brain,
      title: "Model Builder",
      description: "Built first ML model",
      color: "from-purple-400 to-purple-600",
    }
  ];

  const skills = [
    { name: "Python", level: 4 },
    { name: "SQL", level: 3 },
    { name: "Machine Learning", level: 5 },
    { name: "Data Visualization", level: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Progress & Level */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-white text-2xl font-bold">{user?.level}</span>
            </div>
            <h5 className="text-xl font-bold text-gray-900">
              {user?.role?.replace("_", " ") || "Data Scientist"}
            </h5>
            <p className="text-gray-600">Level {user?.level}</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress to Level {(user?.level || 1) + 1}</span>
              <span>{user?.xp} / {nextLevelXp} XP</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              {nextLevelXp - (user?.xp || 0)} XP to next level
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Badges */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badges.map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className={`w-10 h-10 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{badge.title}</h5>
                    <p className="text-sm text-gray-600">{badge.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Skill Radar */}
      <Card>
        <CardHeader>
          <CardTitle>Skill Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600">Skill assessment radar chart</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.name} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{skill.name}</span>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < skill.level ? "bg-blue-500" : "bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Current Goals */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Current Goals</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h5 className="font-medium text-gray-900">Complete EDA Module</h5>
              <Progress value={65} className="mt-2 h-1" />
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <h5 className="font-medium text-gray-900">Deploy First Model</h5>
              <Progress value={30} className="mt-2 h-1" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
