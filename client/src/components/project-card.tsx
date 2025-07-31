import { Project } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Play } from "lucide-react";
import { useLocation } from "wouter";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, setLocation] = useLocation();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{project.title}</CardTitle>
            <p className="text-gray-600 flex items-center space-x-2">
              <span>{project.description}</span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Started {new Date(project.createdAt!).toLocaleDateString()}</span>
              </span>
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="text-sm text-gray-500">Progress</div>
              <div className="text-2xl font-bold text-primary">{project.progress}%</div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-600 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">{project.progress}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-lg font-semibold text-gray-900">Workflow Progress</h4>
          <Button onClick={() => setLocation(`/simulation/${project.id}`)}>
            <Play className="w-4 h-4 mr-2" />
            Continue Pipeline
          </Button>
        </div>
        
        <div className="mb-4">
          <Progress value={project.progress} className="h-2" />
        </div>
        
        <div className="text-sm text-gray-600">
          Current step: <span className="font-medium text-gray-900">{project.currentStep.replace("_", " ")}</span>
        </div>
      </CardContent>
    </Card>
  );
}
