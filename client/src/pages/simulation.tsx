import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import ChartBuilder from "@/components/chart-builder";
import AIMentor from "@/components/ai-mentor";
import ContextualTips from "@/components/contextual-tips";
import MicroChallenges from "@/components/micro-challenges";
import ExplainabilityModule from "@/components/explainability-module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, Play, Brain, BarChart3, Code2, Bot, Lightbulb } from "lucide-react";

export default function Simulation() {
  const [location] = useLocation();
  const [showExplainability, setShowExplainability] = useState(false);
  const [showContextualTips, setShowContextualTips] = useState(false);
  const [tipsType, setTipsType] = useState<'data_upload' | 'data_cleaning' | 'eda' | 'modeling' | 'chart_generation'>('eda');
  const [isUploading, setIsUploading] = useState(false);
  const [forceCurrentStep, setForceCurrentStep] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Get project ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const projectId = urlParams.get('projectId');

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    refetchInterval: 1000, // Refetch every second for immediate updates
    refetchOnWindowFocus: true,
  });

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
    refetchInterval: 1000, // Refetch every second for immediate updates
    refetchOnWindowFocus: true,
  });

  // If no project ID, use the first available project
  const baseProject = projectId ? project : projects?.[0];
  const loading = projectId ? isLoading : projectsLoading;

  // Override the current step if we have a forced value
  const currentProject = baseProject ? {
    ...baseProject,
    currentStep: forceCurrentStep || baseProject.currentStep
  } : null;

  // Log current project state for debugging
  console.log("Current project state:", {
    projectId,
    baseProject: baseProject ? {
      id: baseProject.id,
      currentStep: baseProject.currentStep,
      progress: baseProject.progress
    } : null,
    forceCurrentStep,
    finalCurrentStep: currentProject?.currentStep,
    hasDataset: !!currentProject?.datasetInfo
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!currentProject) throw new Error("No project selected");
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/projects/${currentProject.id}/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: async (data) => {
      console.log("Upload successful:", data);
      
      // Update project to next step after successful upload
      if (currentProject) {
        try {
          const updateResponse = await fetch(`/api/projects/${currentProject.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              currentStep: 'data_cleaning',
              progress: 25,
              datasetInfo: data.dataset
            }),
          });
          const updatedProject = await updateResponse.json();
          console.log("Project updated:", updatedProject);
          
          // Force the UI to show the new step immediately
          setForceCurrentStep('data_cleaning');
        } catch (error) {
          console.error("Failed to update project step:", error);
        }
      }
      
      toast({
        title: "Upload successful",
        description: "Your dataset has been uploaded and analyzed. Moving to data cleaning step.",
      });
      setIsUploading(false);
      
      // Immediately invalidate and refetch to force UI update
      await queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      if (projectId) {
        await queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      }
      await queryClient.refetchQueries({ queryKey: ["/api/projects"] });
      if (projectId) {
        await queryClient.refetchQueries({ queryKey: ["/api/projects", projectId] });
      }
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.size);

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select a file smaller than 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    const allowedTypes = ['.csv', '.xlsx', '.xls', '.json'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV, Excel, or JSON file.",
        variant: "destructive",
      });
      return;
    }

    console.log("Starting upload...");
    setIsUploading(true);
    uploadMutation.mutate(file);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div>Loading your simulation...</div>
        </div>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Projects</h2>
          <p className="text-gray-600 mb-4">Create a new project to start your simulation</p>
          <Button onClick={() => window.location.href = '/roles'}>
            Choose Your Role
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{currentProject.title}</h1>
              <p className="text-gray-600 mt-2">{currentProject.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={currentProject.status === "completed" ? "default" : "secondary"}>
                {currentProject.status.replace("_", " ")}
              </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-primary">{currentProject.progress}%</div>
              </div>
            </div>
          </div>
        </div>

        {currentProject.currentStep === "data_ingestion" && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Data Ingestion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Dataset</h3>
                <p className="text-gray-600 mb-4">Support for CSV, Excel, and JSON files up to 10MB</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls,.json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button onClick={triggerFileUpload} disabled={isUploading || uploadMutation.isPending}>
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading || uploadMutation.isPending ? "Uploading..." : "Choose File"}
                </Button>
                {isUploading && (
                  <div className="mt-2 text-sm text-gray-600">
                    Processing your file...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentProject.currentStep === "data_cleaning" && (
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Data Cleaning & Preprocessing</CardTitle>
                <p className="text-gray-600">Clean and prepare your data for analysis</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Data Quality Issues</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <span className="text-sm">Missing values detected</span>
                        <Button size="sm" variant="outline">Fix</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded">
                        <span className="text-sm">Duplicate rows found</span>
                        <Button size="sm" variant="outline">Remove</Button>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                        <span className="text-sm">Data types validated</span>
                        <Button size="sm" variant="outline">Review</Button>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" className="h-16 flex-col">
                        <div className="text-xs">Remove</div>
                        <div className="text-xs">Outliers</div>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <div className="text-xs">Fill Missing</div>
                        <div className="text-xs">Values</div>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col">
                        <div className="text-xs">Normalize</div>
                        <div className="text-xs">Data</div>
                      </Button>
                      <Button variant="outline" className="h-16 flex-col" onClick={() => {
                        // Move to next step
                        fetch(`/api/projects/${currentProject.id}`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ currentStep: 'eda', progress: 50 })
                        }).then(() => {
                          queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
                          if (projectId) {
                            queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
                          }
                        });
                      }}>
                        <div className="text-xs">Continue to</div>
                        <div className="text-xs">EDA</div>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {(currentProject.currentStep === "eda" || currentProject.currentStep === "modeling") && !showExplainability && (
          <div className="space-y-8">
            {/* Advanced Tools Bar */}
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => window.open(`/code-editor/${currentProject.id}`, '_blank')}>
                      <Code2 className="w-4 h-4 mr-2" />
                      Open Code Editor
                    </Button>
                    <Button variant="outline" onClick={() => setShowExplainability(true)}>
                      <Brain className="w-4 h-4 mr-2" />
                      Model Explainability
                    </Button>
                    <Button 
                      onClick={() => {
                        setTipsType('eda');
                        setShowContextualTips(true);
                      }}
                      variant="outline"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Lightbulb className="w-4 h-4 mr-2" />
                      Get AI Tips
                    </Button>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    <BarChart3 className="w-3 h-3 mr-1" />
                    Advanced Features Active
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ChartBuilder projectId={currentProject.id} />
              <Card>
                <CardHeader>
                  <CardTitle>Dataset Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">customer_id</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">tenure</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">monthly_charges</th>
                          <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">churn</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3 text-sm text-gray-900">CUST_001</td>
                          <td className="py-2 px-3 text-sm text-gray-900">24</td>
                          <td className="py-2 px-3 text-sm text-gray-900">$89.50</td>
                          <td className="py-2 px-3 text-sm">
                            <Badge variant="destructive">Yes</Badge>
                          </td>
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-2 px-3 text-sm text-gray-900">CUST_002</td>
                          <td className="py-2 px-3 text-sm text-gray-900">36</td>
                          <td className="py-2 px-3 text-sm text-gray-900">$65.20</td>
                          <td className="py-2 px-3 text-sm">
                            <Badge variant="secondary">No</Badge>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* AI Integration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* AI Mentor */}
          <div className="lg:col-span-2">
            <AIMentor 
              context={{
                projectTitle: currentProject.title,
                currentStep: finalCurrentStep,
                datasetInfo: currentProject.datasetInfo,
                userLevel: 2
              }}
            />
          </div>
          
          {/* Micro Challenges */}
          <div>
            <MicroChallenges 
              userLevel={2}
              skillArea="data_analysis"
              datasetInfo={currentProject.datasetInfo}
              onChallengeComplete={(xp) => {
                console.log(`Earned ${xp} XP!`);
              }}
            />
          </div>
        </div>

        {/* Contextual Tips */}
        {showContextualTips && (
          <div className="mt-6">
            <ContextualTips 
              triggerType={tipsType}
              datasetInfo={currentProject.datasetInfo}
              userLevel={2}
              onClose={() => setShowContextualTips(false)}
            />
          </div>
        )}

        {/* Explainability Module */}
        {showExplainability && (
          <ExplainabilityModule 
            projectId={currentProject.id} 
            modelType="Random Forest Classifier"
            onClose={() => setShowExplainability(false)}
          />
        )}
      </main>
    </div>
  );
}
