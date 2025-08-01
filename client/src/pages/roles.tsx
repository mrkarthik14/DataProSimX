import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Database, Brain, Search, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Roles() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const createProjectMutation = useMutation({
    mutationFn: async (roleData: { roleId: string; roleName: string }) => {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: `${roleData.roleName} Simulation Project`,
          description: `Complete data science simulation as a ${roleData.roleName}`,
          role: roleData.roleId,
          currentStep: "data_ingestion",
          status: "in_progress",
          progress: 0
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to create project");
      }
      
      return response.json();
    },
    onSuccess: (project) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project Created!",
        description: `Your ${selectedRole} simulation project is ready to begin.`
      });
      setIsCreatingProject(false);
      // Navigate to the simulation with the project ID
      // Navigate to the simulation page
      setLocation(`/simulation`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive"
      });
      setIsCreatingProject(false);
      setSelectedRole(null);
    }
  });

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;
    
    setSelectedRole(role.title);
    setIsCreatingProject(true);
    createProjectMutation.mutate({ roleId, roleName: role.title });
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
            const isSelected = selectedRole === role.title;
            const isLoading = isCreatingProject && isSelected;
            
            return (
              <Card key={role.id} className={`transition-all duration-200 ${
                isSelected ? 'ring-2 ring-primary border-primary shadow-lg' : 'hover:shadow-lg'
              }`}>
                <CardHeader>
                  <div className={`w-16 h-16 bg-gradient-to-br ${role.color} rounded-lg flex items-center justify-center mb-4 relative`}>
                    <IconComponent className="w-8 h-8 text-white" />
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    {role.title}
                    {isSelected && <Badge className="bg-primary text-white">Selected</Badge>}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">{role.description}</p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Key Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {role.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className={`w-full ${isSelected ? 'bg-primary' : ''}`}
                    onClick={() => handleRoleSelect(role.id)}
                    disabled={isCreatingProject}
                  >
                    {isLoading ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Creating Project...
                      </>
                    ) : isSelected ? (
                      <>
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Starting Simulation...
                      </>
                    ) : (
                      <>
                        Start {role.title} Simulation
                      </>
                    )}
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
