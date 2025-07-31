import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import TemplateBrowser from "@/components/template-browser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Briefcase, 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  DollarSign,
  Brain,
  Target,
  Star,
  ChevronRight,
  Calendar,
  Award,
  BookOpen,
  Zap,
  Trophy,
  PlayCircle
} from "lucide-react";

interface RealWorldProject {
  id: string;
  title: string;
  description: string;
  industry: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: string;
  participants: number;
  skills: string[];
  objectives: string[];
  datasets: string[];
  deliverables: string[];
  xpReward: number;
  certificateEligible: boolean;
  featured: boolean;
  tags: string[];
}

export default function EnhancedProjectsHub() {
  const [activeTab, setActiveTab] = useState<"templates" | "realworld" | "challenges">("templates");
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const realWorldProjects: RealWorldProject[] = [
    {
      id: "fraud-detection-system",
      title: "Advanced Fraud Detection System",
      description: "Build a comprehensive fraud detection system for a major payment processor using machine learning and real-time data processing.",
      industry: "Finance",
      difficulty: "advanced",
      duration: "4-6 weeks",
      participants: 156,
      skills: ["Machine Learning", "Real-time Processing", "Anomaly Detection", "Feature Engineering", "Model Deployment"],
      objectives: [
        "Achieve 99.5%+ fraud detection accuracy",
        "Process 10,000+ transactions per second",
        "Minimize false positives under 0.1%",
        "Build explainable AI system",
        "Deploy production-ready pipeline"
      ],
      datasets: ["Transaction History", "User Behavior", "Merchant Data", "Device Fingerprints"],
      deliverables: [
        "ML fraud detection model",
        "Real-time scoring API",
        "Monitoring dashboard",
        "Performance optimization report",
        "Deployment architecture"
      ],
      xpReward: 2500,
      certificateEligible: true,
      featured: true,
      tags: ["ml", "fraud-detection", "real-time", "fintech", "anomaly-detection"]
    },
    {
      id: "customer-segmentation-campaign",
      title: "Customer Segmentation for Marketing Campaign",
      description: "Develop advanced customer segmentation using behavioral analytics and machine learning for a Fortune 500 e-commerce company.",
      industry: "E-commerce/Retail",
      difficulty: "intermediate",
      duration: "2-3 weeks",
      participants: 289,
      skills: ["Clustering", "Customer Analytics", "Marketing Analytics", "Data Visualization", "A/B Testing"],
      objectives: [
        "Identify 5-7 distinct customer segments",
        "Achieve 80%+ segment stability",
        "Increase campaign conversion by 25%",
        "Create actionable marketing personas",
        "Develop segment-specific strategies"
      ],
      datasets: ["Customer Purchase History", "Website Behavior", "Demographics", "Campaign Response Data"],
      deliverables: [
        "Customer segmentation model",
        "Segment profiles and personas",
        "Marketing campaign recommendations",
        "Performance tracking dashboard",
        "A/B testing framework"
      ],
      xpReward: 1500,
      certificateEligible: true,
      featured: false,
      tags: ["clustering", "customer-segmentation", "marketing", "e-commerce", "personalization"]
    },
    {
      id: "supply-chain-optimization",
      title: "Supply Chain Optimization Platform",
      description: "Design an intelligent supply chain optimization system using operations research and machine learning to minimize costs while maintaining service levels.",
      industry: "Logistics/Supply Chain",
      difficulty: "advanced",
      duration: "6-8 weeks",
      participants: 43,
      skills: ["Operations Research", "Optimization", "Supply Chain Analytics", "Network Analysis", "Simulation"],
      objectives: [
        "Reduce total supply chain costs by 15%",
        "Optimize inventory levels across network",
        "Improve delivery performance to 98%",
        "Handle demand uncertainty",
        "Create what-if scenario planning"
      ],
      datasets: ["Historical Demand", "Supplier Data", "Transportation Costs", "Inventory Records"],
      deliverables: [
        "Optimization model",
        "Supply chain simulation",
        "Cost reduction analysis",
        "Performance monitoring system",
        "Strategic recommendations"
      ],
      xpReward: 2800,
      certificateEligible: true,
      featured: true,
      tags: ["supply-chain", "optimization", "operations-research", "logistics", "simulation"]
    }
  ];

  const startProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      return apiRequest(`/api/real-world-projects/${projectId}/start`, {
        method: "POST",
        body: {}
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Project Started!",
        description: "Real-world project has been added to your workspace."
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive"
      });
    }
  });

  const handleTemplateStart = (templateId: string) => {
    toast({
      title: "Template Project Started!",
      description: "Your new project has been created and is ready to begin."
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-100 text-green-800";
      case "intermediate": return "bg-yellow-100 text-yellow-800";
      case "advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getIndustryIcon = (industry: string) => {
    switch (industry.toLowerCase()) {
      case "finance": return Shield;
      case "e-commerce/retail": return DollarSign;
      case "logistics/supply chain": return Target;
      default: return Briefcase;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">DataProSimX Project Hub</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Choose from professionally-designed templates or tackle real-world industry challenges to build your data science portfolio
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="text-center bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="py-6">
              <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-900">12+</div>
              <div className="text-sm text-blue-700">Project Templates</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="py-6">
              <Briefcase className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-900">8+</div>
              <div className="text-sm text-green-700">Real-World Projects</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="py-6">
              <Trophy className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-purple-900">5+</div>
              <div className="text-sm text-purple-700">Certificates Available</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="py-6">
              <Zap className="w-8 h-8 text-orange-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-orange-900">15K+</div>
              <div className="text-sm text-orange-700">Total XP Available</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="templates" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="realworld" className="flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Real-World
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Challenges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            <TemplateBrowser onTemplateStart={handleTemplateStart} />
          </TabsContent>

          <TabsContent value="realworld" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Real-World Industry Projects</h2>
              <p className="text-gray-600">Work on actual business problems with real data and stakeholder requirements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {realWorldProjects.map((project) => {
                const IconComponent = getIndustryIcon(project.industry);
                return (
                  <Card key={project.id} className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="w-5 h-5 text-primary" />
                            <Badge className={getDifficultyColor(project.difficulty)}>
                              {project.difficulty}
                            </Badge>
                            {project.featured && (
                              <Badge className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors mb-2">
                            {project.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {project.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {project.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {project.participants}
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {project.xpReward} XP
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pt-0">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium text-sm text-gray-900 mb-2">Key Skills</h4>
                          <div className="flex flex-wrap gap-1">
                            {project.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {project.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{project.skills.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {project.certificateEligible && (
                            <Badge className="bg-green-100 text-green-800">
                              Certificate Eligible
                            </Badge>
                          )}
                          <div className="ml-auto">
                            <Button 
                              onClick={() => startProjectMutation.mutate(project.id)}
                              disabled={startProjectMutation.isPending}
                              className="bg-primary hover:bg-primary/90"
                            >
                              <PlayCircle className="w-4 h-4 mr-2" />
                              Start Project
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Micro-Challenges Coming Soon</h3>
              <p className="text-gray-600 mb-4">Gamified skill-building challenges are being prepared for you</p>
              <Button variant="outline" onClick={() => setActiveTab("templates")}>
                Explore Templates Instead
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}