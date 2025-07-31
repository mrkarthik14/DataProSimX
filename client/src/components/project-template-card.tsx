import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ProjectTemplate } from "@/lib/project-templates";
import { 
  Clock, 
  Target, 
  Award, 
  Users, 
  Database,
  PlayCircle,
  ChevronRight,
  Star,
  Trophy,
  CheckCircle
} from "lucide-react";

interface ProjectTemplateCardProps {
  template: ProjectTemplate;
  onStart?: (templateId: string) => void;
}

export default function ProjectTemplateCard({ template, onStart }: ProjectTemplateCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const startProjectMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(`/api/projects`, {
        method: "POST",
        body: {
          title: template.title,
          description: template.description,
          role: template.domain.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          currentStep: "data_ingestion",
          status: "in_progress",
          progress: 0,
          templateId: template.id
        }
      });
    },
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: "Project Started!",
        description: `${template.title} has been added to your projects.`
      });
      onStart?.(template.id);
      setIsStarting(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to start project. Please try again.",
        variant: "destructive"
      });
      setIsStarting(false);
    }
  });

  const handleStartProject = () => {
    setIsStarting(true);
    startProjectMutation.mutate();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-primary transition-colors">
              {template.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {template.description}
            </p>
          </div>
          {template.badge && (
            <Trophy className="w-5 h-5 text-yellow-500 ml-2 flex-shrink-0" />
          )}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Badge className={getDifficultyColor(template.difficulty)}>
            {template.difficulty}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {template.domain}
          </Badge>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {template.estimatedTime}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-500" />
              <span className="text-gray-600">{template.objectives.length} Objectives</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              <span className="text-gray-600">{template.xpReward} XP</span>
            </div>
          </div>

          {/* Tools */}
          <div>
            <div className="flex flex-wrap gap-1">
              {template.tools.slice(0, 4).map((tool) => (
                <Badge key={tool} variant="secondary" className="text-xs">
                  {tool}
                </Badge>
              ))}
              {template.tools.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{template.tools.length - 4} more
                </Badge>
              )}
            </div>
          </div>

          {/* Expandable Details */}
          {isExpanded && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Learning Objectives</h4>
                <ul className="space-y-1">
                  {template.objectives.map((objective, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Project Steps</h4>
                <div className="space-y-2">
                  {template.steps.map((step, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3">
                      <div className="font-medium text-sm text-gray-900">{step.title}</div>
                      <div className="text-xs text-gray-600 mt-1">{step.description}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-sm text-gray-900 mb-2">Datasets</h4>
                <div className="space-y-1">
                  {template.datasets.map((dataset, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <Database className="w-3 h-3 text-blue-500" />
                      <span className="font-medium">{dataset.name}</span>
                      <span className="text-gray-400">({dataset.rows.toLocaleString()} rows)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isExpanded ? 'Show Less' : 'Learn More'}
              <ChevronRight className={`w-4 h-4 ml-1 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
            </Button>

            <Button
              onClick={handleStartProject}
              disabled={isStarting}
              className="bg-primary hover:bg-primary/90"
            >
              {isStarting ? (
                <>Starting...</>
              ) : (
                <>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Start Project
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}