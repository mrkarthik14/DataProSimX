import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Lightbulb, X, RefreshCw, ChevronRight } from "lucide-react";

interface ContextualTip {
  type: 'data_upload' | 'data_cleaning' | 'eda' | 'modeling' | 'chart_generation';
  title: string;
  content: string;
  actionable: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface ContextualTipsProps {
  triggerType: ContextualTip['type'];
  datasetInfo?: any;
  userLevel?: number;
  onClose?: () => void;
  autoShow?: boolean;
}

export default function ContextualTips({ 
  triggerType, 
  datasetInfo, 
  userLevel = 1, 
  onClose,
  autoShow = true 
}: ContextualTipsProps) {
  const [isVisible, setIsVisible] = useState(autoShow);
  const [expandedTip, setExpandedTip] = useState<number | null>(null);

  const { data: tipsData, refetch, isLoading } = useQuery({
    queryKey: ['contextual-tips', triggerType, userLevel],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/tips", {
        type: triggerType,
        datasetInfo,
        userLevel,
        recentActions: []
      });
      return response.json();
    },
    enabled: isVisible
  });

  const tips: ContextualTip[] = tipsData?.tips || [];

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'data_upload': return 'Data Upload Tips';
      case 'data_cleaning': return 'Data Cleaning Tips';
      case 'eda': return 'Exploratory Analysis Tips';
      case 'modeling': return 'Modeling Tips';
      case 'chart_generation': return 'Visualization Tips';
      default: return 'Helpful Tips';
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-blue-800">
            <Lightbulb className="w-5 h-5 mr-2" />
            {getTypeTitle(triggerType)}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-sm text-blue-700">
          AI-generated suggestions to help you with your current task
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-blue-600">Generating personalized tips...</span>
          </div>
        ) : tips.length > 0 ? (
          <div className="space-y-3">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white border border-blue-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-gray-900">{tip.title}</h4>
                      <Badge 
                        variant="secondary" 
                        className={getDifficultyColor(tip.difficulty)}
                      >
                        {tip.difficulty}
                      </Badge>
                      {tip.actionable && (
                        <Badge variant="outline" className="text-xs">
                          Actionable
                        </Badge>
                      )}
                    </div>
                    
                    <div className={`text-sm text-gray-700 ${
                      expandedTip === index ? '' : 'line-clamp-2'
                    }`}>
                      {tip.content}
                    </div>
                    
                    {tip.content.length > 100 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedTip(
                          expandedTip === index ? null : index
                        )}
                        className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800"
                      >
                        <ChevronRight 
                          className={`w-4 h-4 transition-transform ${
                            expandedTip === index ? 'rotate-90' : ''
                          }`} 
                        />
                        {expandedTip === index ? 'Show less' : 'Show more'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Lightbulb className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No tips available at the moment.</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()}
              className="mt-2"
            >
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}