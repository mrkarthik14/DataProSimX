import { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Database, Fan, BarChart3, Brain, Rocket } from "lucide-react";

interface WorkflowProgressProps {
  project: Project;
}

interface WorkflowStep {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  status: "completed" | "in_progress" | "pending";
}

export default function WorkflowProgress({ project }: WorkflowProgressProps) {
  const steps: WorkflowStep[] = [
    {
      id: "data_ingestion",
      title: "Data Ingestion",
      icon: Database,
      status: "completed",
    },
    {
      id: "data_cleaning",
      title: "Data Cleaning", 
      icon: Fan,
      status: "completed",
    },
    {
      id: "eda",
      title: "EDA & Visualization",
      icon: BarChart3,
      status: project.currentStep === "eda" ? "in_progress" : project.currentStep === "modeling" || project.currentStep === "deployment" ? "completed" : "pending",
    },
    {
      id: "modeling",
      title: "ML Modeling",
      icon: Brain,
      status: project.currentStep === "modeling" ? "in_progress" : project.currentStep === "deployment" ? "completed" : "pending",
    },
    {
      id: "deployment",
      title: "Deployment",
      icon: Rocket,
      status: project.currentStep === "deployment" ? "in_progress" : "pending",
    },
  ];

  const getStepColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in_progress":
        return "bg-orange-500 animate-pulse";
      default:
        return "bg-gray-300";
    }
  };

  const getStepIcon = (step: WorkflowStep) => {
    const IconComponent = step.icon;
    if (step.status === "completed") {
      return <Check className="w-5 h-5 text-white" />;
    }
    return <IconComponent className="w-5 h-5 text-white" />;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>;
      case "in_progress":
        return <Badge variant="default" className="bg-orange-100 text-orange-800">In Progress</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${getStepColor(step.status)}`}>
                {getStepIcon(step)}
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
                {getStatusBadge(step.status)}
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-6" 
                     style={{ zIndex: -1 }} />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
