import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import ChartBuilder from "@/components/chart-builder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Upload, Play } from "lucide-react";

export default function Simulation() {
  const { projectId } = useParams();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  if (isLoading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Project not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
              <p className="text-gray-600 mt-2">{project.description}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                {project.status.replace("_", " ")}
              </Badge>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="text-2xl font-bold text-primary">{project.progress}%</div>
              </div>
            </div>
          </div>
        </div>

        {project.currentStep === "data_ingestion" && (
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

        {(project.currentStep === "eda" || project.currentStep === "modeling") && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ChartBuilder projectId={project.id} />
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
        )}
      </main>
    </div>
  );
}
