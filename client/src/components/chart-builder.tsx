import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';
import { Project } from "@shared/schema";

interface ChartBuilderProps {
  projectId?: number;
}

interface ChartData {
  data: Array<any>;
  insights: string[];
  dataset?: {
    filename: string;
    rows: number;
    columns: string[];
  };
}

export default function ChartBuilder({ projectId }: ChartBuilderProps) {
  const [chartType, setChartType] = useState("bar");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartData, setChartData] = useState<ChartData | null>(null);

  // Get project data to access dataset info
  const { data: project } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Set default axes based on available columns
  useEffect(() => {
    if (project?.datasetInfo && Array.isArray(project.datasetInfo.columns)) {
      const columns = project.datasetInfo.columns;
      if (!xAxis && columns.length > 0) {
        setXAxis(columns[0]);
      }
      if (!yAxis && columns.length > 1) {
        setYAxis(columns[1]);
      }
    }
  }, [project, xAxis, yAxis]);

  const generateChartMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) throw new Error("No project selected");
      
      const response = await apiRequest("POST", `/api/projects/${projectId}/chart`, {
        chartType,
        xAxis,
        yAxis,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setChartData(data);
    },
  });

  const handleGenerateChart = () => {
    generateChartMutation.mutate();
  };

  const availableColumns = project?.datasetInfo?.columns || [];

  const renderChart = () => {
    if (!chartData || !chartData.data) return null;

    const data = chartData.data;

    switch (chartType) {
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis dataKey={yAxis} />
              <Tooltip />
              <Scatter dataKey={yAxis} fill="#8884d8" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey={yAxis} stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        );
      default: // bar chart
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={xAxis} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={yAxis} fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dataset Info */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Analysis</CardTitle>
          {project?.datasetInfo && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{project.datasetInfo.filename}</span>
              <span>•</span>
              <span>{project.datasetInfo.rows} rows</span>
              <span>•</span>
              <span>{availableColumns.length} columns</span>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {availableColumns.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Available Columns:</h4>
              <div className="flex flex-wrap gap-2">
                {availableColumns.map((column, index) => (
                  <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {column}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">No dataset uploaded yet. Please upload a dataset first.</div>
          )}
        </CardContent>
      </Card>

      {/* Chart Builder */}
      {availableColumns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chart Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Chart Type</Label>
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="scatter">Scatter Plot</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>X-Axis</Label>
                <Select value={xAxis} onValueChange={setXAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select X-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Y-Axis</Label>
                <Select value={yAxis} onValueChange={setYAxis}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Y-axis column" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableColumns.map((column) => (
                      <SelectItem key={column} value={column}>
                        {column}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleGenerateChart} 
              disabled={generateChartMutation.isPending || !xAxis || !yAxis}
              className="w-full"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {generateChartMutation.isPending ? "Generating..." : "Generate Chart"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Chart Display */}
      {chartData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              {chartType.charAt(0).toUpperCase() + chartType.slice(1)} Chart: {xAxis} vs {yAxis}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderChart()}
            
            {/* Insights */}
            {chartData.insights && chartData.insights.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Data Insights</h4>
                <div className="space-y-2">
                  {chartData.insights.map((insight, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <p className="text-gray-700 text-sm">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}