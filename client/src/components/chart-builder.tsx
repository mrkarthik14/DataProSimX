import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { BarChart3, Download, Share } from "lucide-react";

interface ChartBuilderProps {
  projectId?: number;
}

interface ChartData {
  data: Array<{ x: number; y: number; category: string }>;
  insights: string[];
}

export default function ChartBuilder({ projectId }: ChartBuilderProps) {
  const [chartType, setChartType] = useState("histogram");
  const [xAxis, setXAxis] = useState("tenure");
  const [yAxis, setYAxis] = useState("monthly_charges");
  const [chartData, setChartData] = useState<ChartData | null>(null);

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

  return (
    <div className="space-y-6">
      {/* Data Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Dataset Preview</CardTitle>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>10,000 rows</span>
            <span>•</span>
            <span>18 columns</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">customer_id</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">tenure</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">monthly_charges</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">total_charges</th>
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-900">churn</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm text-gray-900">CUST_001</td>
                  <td className="py-2 px-3 text-sm text-gray-900">24</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$89.50</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$2,148.00</td>
                  <td className="py-2 px-3 text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Yes</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm text-gray-900">CUST_002</td>
                  <td className="py-2 px-3 text-sm text-gray-900">36</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$65.20</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$2,347.20</td>
                  <td className="py-2 px-3 text-sm">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">No</span>
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-3 text-sm text-gray-900">CUST_003</td>
                  <td className="py-2 px-3 text-sm text-gray-900">12</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$45.30</td>
                  <td className="py-2 px-3 text-sm text-gray-900">$543.60</td>
                  <td className="py-2 px-3 text-sm">
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Yes</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Chart Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Chart Type</Label>
            <Select value={chartType} onValueChange={setChartType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="histogram">Histogram</SelectItem>
                <SelectItem value="scatter">Scatter Plot</SelectItem>
                <SelectItem value="boxplot">Box Plot</SelectItem>
                <SelectItem value="heatmap">Correlation Heatmap</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>X-Axis</Label>
            <Select value={xAxis} onValueChange={setXAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tenure">tenure</SelectItem>
                <SelectItem value="monthly_charges">monthly_charges</SelectItem>
                <SelectItem value="total_charges">total_charges</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Y-Axis</Label>
            <Select value={yAxis} onValueChange={setYAxis}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monthly_charges">monthly_charges</SelectItem>
                <SelectItem value="total_charges">total_charges</SelectItem>
                <SelectItem value="churn">churn</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleGenerateChart}
            disabled={generateChartMutation.isPending}
            className="w-full"
          >
            {generateChartMutation.isPending ? "Generating..." : "Generate Chart"}
          </Button>
          
          {chartData && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h5 className="text-sm font-medium text-gray-900 mb-3">Generated Insights</h5>
              <div className="space-y-2 text-sm text-gray-600">
                {chartData.insights.map((insight, index) => (
                  <p key={index}>• {insight}</p>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visualization Results */}
      {chartData && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Visualization</CardTitle>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  {xAxis} vs {yAxis} {chartType.charAt(0).toUpperCase() + chartType.slice(1)}
                </h5>
                <p className="text-gray-600 max-w-md">
                  Interactive {chartType} showing relationship between {xAxis} and {yAxis}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
