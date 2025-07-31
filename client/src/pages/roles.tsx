import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Database, Brain, Search } from "lucide-react";
import { useLocation } from "wouter";

export default function Roles() {
  const [, setLocation] = useLocation();

  const roles = [
    {
      id: "data_analyst",
      title: "Data Analyst",
      description: "Focus on data exploration, visualization, and business insights",
      icon: BarChart3,
      color: "from-blue-500 to-blue-600",
      skills: ["SQL", "Excel", "Tableau", "Statistical Analysis"],
    },
    {
      id: "data_engineer",
      title: "Data Engineer", 
      description: "Build and maintain data pipelines and infrastructure",
      icon: Database,
      color: "from-green-500 to-green-600",
      skills: ["Python", "SQL", "ETL", "Cloud Platforms"],
    },
    {
      id: "ml_engineer",
      title: "ML Engineer",
      description: "Design, build, and deploy machine learning models",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      skills: ["Python", "TensorFlow", "MLOps", "Model Deployment"],
    },
    {
      id: "ai_researcher",
      title: "AI Researcher",
      description: "Explore cutting-edge AI techniques and algorithms",
      icon: Search,
      color: "from-red-500 to-red-600",
      skills: ["Deep Learning", "Research", "PyTorch", "Publications"],
    },
  ];

  const handleRoleSelect = (roleId: string) => {
    // Create new project with selected role
    setLocation("/simulation");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Data Science Path</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Select a role to begin your simulation journey. Each path offers unique challenges and learning opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role) => {
            const IconComponent = role.icon;
            return (
              <Card key={role.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center mb-4`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{role.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <span key={skill} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full"
                    onClick={() => handleRoleSelect(role.id)}
                  >
                    Start {role.title} Simulation
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
