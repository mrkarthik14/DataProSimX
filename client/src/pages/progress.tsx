import { useQuery } from "@tanstack/react-query";
import { User, Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Target, Calendar } from "lucide-react";

export default function ProgressPage() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const completedProjects = projects?.filter(p => p.status === "completed") || [];
  const inProgressProjects = projects?.filter(p => p.status === "in_progress") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Progress</h1>
          <p className="text-gray-600">Track your data science journey and achievements</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Progress Overview */}
          <div className="lg:col-span-2 space-y-6">
            {/* Level Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span>Level Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white text-2xl font-bold">{user?.level}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{user?.role?.replace("_", " ") || "Data Scientist"}</h3>
                  <p className="text-gray-600">Level {user?.level}</p>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to Level {(user?.level || 1) + 1}</span>
                    <span>{user?.xp} / {((user?.level || 1) + 1) * 1000} XP</span>
                  </div>
                  <Progress value={((user?.xp || 0) % 1000) / 10} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Project History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span>Project History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projects?.map((project) => (
                    <div key={project.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="font-semibold text-gray-900">{project.title}</h4>
                        <p className="text-sm text-gray-600">{project.description}</p>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                          {project.status.replace("_", " ")}
                        </Badge>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Progress</div>
                          <div className="text-lg font-bold text-primary">{project.progress}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements Sidebar */}
          <div className="space-y-6">
            {/* Recent Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Badges</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(Array.isArray(user?.badges) ? user.badges.slice(-3) : []).map((badge: any, index: number) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h5 className="font-medium text-gray-900">{badge.title}</h5>
                        <p className="text-sm text-gray-600">Earned recently</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { skill: "Python", level: 4 },
                    { skill: "SQL", level: 3 },
                    { skill: "Machine Learning", level: 5 },
                    { skill: "Data Visualization", level: 4 },
                  ].map((item) => (
                    <div key={item.skill} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{item.skill}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < item.level ? "bg-blue-500" : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Goals */}
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
        </div>
      </main>
    </div>
  );
}
