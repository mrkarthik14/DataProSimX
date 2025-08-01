import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import ChartBuilder from "@/components/chart-builder";
import ExplainabilityModule from "@/components/explainability-module";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Play, Brain, BarChart3, Code2 } from "lucide-react";

export default function Simulation() {
  const [location] = useLocation();
  const [showExplainability, setShowExplainability] = useState(false);
  
  // Get project ID from URL parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const projectId = urlParams.get('projectId');

  const { data: projects, isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // If no project ID, use the first available project
  const currentProject = projectId ? project : projects?.[0];
  const loading = projectId ? isLoading : projectsLoading;

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
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
              </div>
            </CardContent>
          </Card>
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
