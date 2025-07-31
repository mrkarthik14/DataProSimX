import { useQuery } from "@tanstack/react-query";
import { User, Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import ProjectCard from "@/components/project-card";
import ChartBuilder from "@/components/chart-builder";
import AiMentor from "@/components/ai-mentor";
import GamificationSidebar from "@/components/gamification-sidebar";
import WorkflowProgress from "@/components/workflow-progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Play, Bot, BarChart3, Rocket, Trophy, Flame, Medal } from "lucide-react";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [, setLocation] = useLocation();

  const { data: user, isLoading: userLoading } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const currentProject = projects?.find(p => p.status === "in_progress");

  if (userLoading || projectsLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold mb-2">Welcome back, Data Scientist! 🚀</h2>
                  <p className="text-blue-100 text-lg mb-4">Continue your journey to mastering real-world data science workflows</p>
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-amber-300" />
                      <span className="font-medium">{projects?.filter(p => p.status === "completed").length || 0} Projects Completed</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Flame className="w-5 h-5 text-orange-300" />
                      <span className="font-medium">7 Day Streak</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Medal className="w-5 h-5 text-yellow-300" />
                      <span className="font-medium">{user?.badges?.length || 0} Badges Earned</span>
                    </div>
                  </div>
                </div>
                <div className="hidden lg:flex items-center">
                  <div className="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <Rocket className="w-16 h-16 text-white opacity-80" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
            <Button variant="ghost" onClick={() => setLocation("/simulation")}>
              View All Projects <span className="ml-1">→</span>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/roles")}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-4">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Start New Project</h4>
                <p className="text-gray-600 text-sm">Begin a fresh data science simulation</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => currentProject && setLocation(`/simulation/${currentProject.id}`)}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Continue Project</h4>
                <p className="text-gray-600 text-sm">Resume your current simulation</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Mentor</h4>
                <p className="text-gray-600 text-sm">Get personalized guidance</p>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation("/progress")}>
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">View Progress</h4>
                <p className="text-gray-600 text-sm">Track your learning journey</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Current Project */}
        {currentProject && (
          <section className="mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Current Project</h3>
            <ProjectCard project={currentProject} />
          </section>
        )}

        {/* Simulation Workspace */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">EDA & Visualization Studio</h3>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">Save Progress</Button>
              <Button variant="outline" size="sm">Export Code</Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Bot className="w-4 h-4 mr-2" />AI Mentor
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartBuilder projectId={currentProject?.id} />
            </div>
            <div>
              <AiMentor />
            </div>
          </div>
        </section>

        {/* Gamification Sidebar */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {currentProject && <WorkflowProgress project={currentProject} />}
            </div>
            <div>
              <GamificationSidebar user={user} />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
