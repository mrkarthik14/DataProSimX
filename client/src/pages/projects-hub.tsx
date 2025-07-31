import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { PROJECT_TEMPLATES, getTemplatesByDifficulty, getTemplatesByDomain } from "@/lib/project-templates";
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
  Search,
  Filter,
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

export default function ProjectsHub() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProject, setSelectedProject] = useState<RealWorldProject | null>(null);

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  const realWorldProjects: RealWorldProject[] = [
    {
      id: "fraud-detection-system",
      title: "Build a Fraud Detection System",
      description: "Design and implement a real-time fraud detection system for financial transactions using machine learning. Work with imbalanced datasets, feature engineering, and deployment considerations.",
      industry: "Finance",
      difficulty: "advanced",
      duration: "4-6 weeks",
      participants: 156,
      skills: ["Machine Learning", "Python", "Real-time Processing", "Feature Engineering", "Model Deployment"],
      objectives: [
        "Achieve 95%+ precision with minimal false positives",
        "Handle class imbalance (0.1% fraud rate)",
        "Process 10,000+ transactions per second",
        "Implement real-time scoring API",
        "Create explainable model decisions"
      ],
      datasets: ["Credit Card Transactions", "User Behavior Data", "Historical Fraud Cases"],
      deliverables: [
        "Trained ML model with performance metrics",
        "Real-time scoring API",
        "Fraud detection dashboard",
        "Technical documentation",
        "Business presentation"
      ],
      xpReward: 2500,
      certificateEligible: true,
      featured: true,
      tags: ["machine-learning", "fraud-detection", "real-time", "finance", "classification"]
    },
    {
      id: "revenue-forecasting",
      title: "Forecast Next Quarter's Revenue",
      description: "Build a comprehensive revenue forecasting model for a SaaS company using time series analysis, external factors, and business metrics to predict quarterly performance.",
      industry: "SaaS/Technology",
      difficulty: "intermediate",
      duration: "3-4 weeks",
      participants: 203,
      skills: ["Time Series Analysis", "Business Analytics", "Statistical Modeling", "Data Visualization"],
      objectives: [
        "Achieve <5% MAPE (Mean Absolute Percentage Error)",
        "Incorporate seasonality and trends",
        "Account for external market factors",
        "Provide confidence intervals",
        "Generate actionable business insights"
      ],
      datasets: ["Historical Revenue Data", "Customer Metrics", "Market Indicators", "Product Usage Data"],
      deliverables: [
        "Time series forecasting model",
        "Interactive revenue dashboard",
        "Scenario analysis tool",
        "Executive summary report",
        "Model validation documentation"
      ],
      xpReward: 1800,
      certificateEligible: true,
      featured: true,
      tags: ["time-series", "forecasting", "business-analytics", "revenue", "saas"]
    },
    {
      id: "customer-segmentation-campaign",
      title: "Segment Customers for Marketing Campaign",
      description: "Develop a customer segmentation strategy using clustering algorithms and behavioral analysis to optimize marketing campaigns and increase conversion rates.",
      industry: "E-commerce/Retail",
      difficulty: "intermediate",
      duration: "2-3 weeks",
      participants: 89,
      skills: ["Clustering", "Customer Analytics", "Marketing Analytics", "Data Visualization"],
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
      id: "predictive-maintenance",
      title: "Predictive Maintenance for Manufacturing",
      description: "Build a predictive maintenance system for industrial equipment using IoT sensor data and machine learning to reduce downtime and maintenance costs.",
      industry: "Manufacturing",
      difficulty: "advanced",
      duration: "5-7 weeks",
      participants: 67,
      skills: ["IoT Analytics", "Anomaly Detection", "Time Series", "Predictive Modeling", "Industrial Engineering"],
      objectives: [
        "Predict failures 2-4 weeks in advance",
        "Reduce unplanned downtime by 40%",
        "Optimize maintenance schedules",
        "Handle multi-sensor data streams",
        "Implement alert system"
      ],
      datasets: ["Sensor Readings", "Maintenance Records", "Equipment Specifications", "Production Schedules"],
      deliverables: [
        "Predictive maintenance model",
        "Real-time monitoring dashboard",
        "Maintenance scheduling system",
        "Cost-benefit analysis",
        "Implementation roadmap"
      ],
      xpReward: 2200,
      certificateEligible: true,
      featured: false,
      tags: ["predictive-maintenance", "iot", "manufacturing", "anomaly-detection", "time-series"]
    },
    {
      id: "social-media-sentiment",
      title: "Social Media Sentiment Analysis Engine",
      description: "Create a comprehensive sentiment analysis system for social media monitoring, brand reputation management, and customer feedback analysis.",
      industry: "Marketing/Social Media",
      difficulty: "beginner",
      duration: "2-3 weeks",
      participants: 312,
      skills: ["Natural Language Processing", "Sentiment Analysis", "Social Media APIs", "Text Mining"],
      objectives: [
        "Achieve 85%+ sentiment accuracy",
        "Process 100K+ posts daily",
        "Support multiple platforms",
        "Identify trending topics",
        "Generate automated reports"
      ],
      datasets: ["Twitter Data", "Facebook Posts", "Review Data", "News Articles"],
      deliverables: [
        "Sentiment analysis model",
        "Social media monitoring dashboard",
        "Trend analysis reports",
        "API for real-time scoring",
        "Brand reputation metrics"
      ],
      xpReward: 1200,
      certificateEligible: false,
      featured: false,
      tags: ["nlp", "sentiment-analysis", "social-media", "text-mining", "brand-monitoring"]
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

  const categories = [
    { id: "all", label: "All Projects", count: realWorldProjects.length },
    { id: "beginner", label: "Beginner", count: realWorldProjects.filter(p => p.difficulty === "beginner").length },
    { id: "intermediate", label: "Intermediate", count: realWorldProjects.filter(p => p.difficulty === "intermediate").length },
    { id: "advanced", label: "Advanced", count: realWorldProjects.filter(p => p.difficulty === "advanced").length },
    { id: "featured", label: "Featured", count: realWorldProjects.filter(p => p.featured).length },
    { id: "certificate", label: "Certificate", count: realWorldProjects.filter(p => p.certificateEligible).length },
  ];

  const startProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const response = await apiRequest("POST", `/api/real-world-projects/${projectId}/start`, {});
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const filteredProjects = realWorldProjects.filter(project => {
    if (selectedCategory === "all") return true;
    if (selectedCategory === "featured") return project.featured;
    if (selectedCategory === "certificate") return project.certificateEligible;
    return project.difficulty === selectedCategory;
  });

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
      case "saas/technology": return TrendingUp;
      case "e-commerce/retail": return DollarSign;
      case "manufacturing": return Briefcase;
      case "marketing/social media": return Users;
      case "logistics/supply chain": return Target;
      default: return Briefcase;
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
              <h1 className="text-3xl font-bold text-gray-900">Real-World Projects Hub</h1>
              <p className="text-gray-600 mt-2">Tackle industry challenges and build your professional portfolio</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 px-4 py-2 rounded-full border border-purple-200">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="font-medium text-purple-700">
                    {realWorldProjects.filter(p => p.certificateEligible).length} Certificate Projects
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Categories */}
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                        selectedCategory === category.id
                          ? "bg-primary text-white border-primary"
                          : "bg-white hover:bg-gray-50 border-gray-200"
                      }`}
                    >
                      <span className="text-sm font-medium">{category.label}</span>
                      <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                        {category.count}
                      </Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Projects Started</span>
                    <span className="font-medium">2</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Completed</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Certificates Earned</span>
                    <span className="font-medium">1</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total XP from Projects</span>
                    <span className="font-medium text-primary">1,800 XP</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredProjects.map((project) => {
                const IndustryIcon = getIndustryIcon(project.industry);
                
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2">
                          <IndustryIcon className="w-5 h-5 text-gray-600" />
                          <span className="text-sm text-gray-600">{project.industry}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getDifficultyColor(project.difficulty)}>
                            {project.difficulty}
                          </Badge>
                          {project.featured && (
                            <Badge className="bg-purple-100 text-purple-800">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardTitle className="text-lg mt-2">{project.title}</CardTitle>
                    </CardHeader>
                    
                    <CardContent>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{project.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-gray-600">{project.participants} participants</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="font-medium">{project.xpReward} XP</span>
                          </div>
                          {project.certificateEligible && (
                            <div className="flex items-center space-x-1">
                              <Award className="w-4 h-4 text-purple-500" />
                              <span className="text-purple-600 text-xs font-medium">Certificate</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.skills.slice(0, 3).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {project.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{project.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          className="flex-1"
                          onClick={() => startProjectMutation.mutate(project.id)}
                          disabled={startProjectMutation.isPending}
                        >
                          Start Project
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setSelectedProject(project)}
                        >
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        {/* Project Details Modal */}
        {selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h2>
                    <p className="text-gray-600 mt-1">{selectedProject.industry}</p>
                  </div>
                  <Button variant="outline" onClick={() => setSelectedProject(null)}>
                    Close
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-semibold mb-2">Project Objectives</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedProject.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Target className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Skills You'll Develop</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.skills.map((skill) => (
                        <Badge key={skill} variant="outline">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-2">Datasets Provided</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedProject.datasets.map((dataset, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Brain className="w-4 h-4 text-blue-500" />
                          <span>{dataset}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold mb-2">Deliverables</h3>
                    <ul className="space-y-1 text-sm">
                      {selectedProject.deliverables.map((deliverable, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <Award className="w-4 h-4 text-purple-500" />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{selectedProject.xpReward}</div>
                        <div className="text-sm text-gray-600">XP Reward</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedProject.duration}</div>
                        <div className="text-sm text-gray-600">Duration</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">{selectedProject.participants}</div>
                        <div className="text-sm text-gray-600">Participants</div>
                      </div>
                    </div>
                    <Button 
                      size="lg"
                      onClick={() => {
                        startProjectMutation.mutate(selectedProject.id);
                        setSelectedProject(null);
                      }}
                      disabled={startProjectMutation.isPending}
                    >
                      Start This Project
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}