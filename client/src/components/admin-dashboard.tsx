import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  TrendingUp, 
  Clock, 
  Target,
  Award,
  Database,
  Zap,
  BarChart3,
  PieChart,
  LineChart,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";

interface AdminMetrics {
  activeUsers: number;
  totalProjects: number;
  completionRate: number;
  avgSessionDuration: number;
  totalXP: number;
  dailyActiveUsers: number[];
  projectsByDifficulty: { difficulty: string; count: number }[];
  topPerformingProjects: { name: string; completions: number; avgRating: number }[];
  userEngagementMetrics: {
    newUsers: number;
    returningUsers: number;
    churned: number;
  };
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

  // Mock admin metrics - in real app, this would come from analytics API
  const mockMetrics: AdminMetrics = {
    activeUsers: 1847,
    totalProjects: 3421,
    completionRate: 68.5,
    avgSessionDuration: 45.7,
    totalXP: 2156789,
    dailyActiveUsers: [245, 298, 267, 341, 389, 412, 356, 398, 445, 423, 367, 291, 334, 378, 402, 456, 434, 389, 367, 345, 378, 402, 445, 467, 489, 456, 423, 389, 367, 345],
    projectsByDifficulty: [
      { difficulty: "Beginner", count: 1245 },
      { difficulty: "Intermediate", count: 1876 },
      { difficulty: "Advanced", count: 300 }
    ],
    topPerformingProjects: [
      { name: "Customer Churn Prediction", completions: 567, avgRating: 4.8 },
      { name: "Fraud Detection System", completions: 423, avgRating: 4.7 },
      { name: "Sales Forecasting Dashboard", completions: 389, avgRating: 4.6 },
      { name: "Social Media Sentiment Analysis", completions: 345, avgRating: 4.5 }
    ],
    userEngagementMetrics: {
      newUsers: 134,
      returningUsers: 1523,
      churned: 67
    }
  };

  const getTimeRangeLabel = (range: string) => {
    switch (range) {
      case "7d": return "Last 7 Days";
      case "30d": return "Last 30 Days";
      case "90d": return "Last 90 Days";
      default: return "Last 30 Days";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={{ id: "admin", username: "Admin", role: "admin" } as any} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Platform analytics and user insights</p>
            </div>
            <div className="flex items-center space-x-2">
              <select 
                value={timeRange} 
                onChange={(e) => setTimeRange(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Active Users</p>
                  <p className="text-3xl font-bold text-blue-900">{mockMetrics.activeUsers.toLocaleString()}</p>
                  <p className="text-xs text-blue-600 mt-1">+12.5% from last month</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Total Projects</p>
                  <p className="text-3xl font-bold text-green-900">{mockMetrics.totalProjects.toLocaleString()}</p>
                  <p className="text-xs text-green-600 mt-1">+8.3% from last month</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-purple-900">{mockMetrics.completionRate}%</p>
                  <p className="text-xs text-purple-600 mt-1">+2.1% from last month</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">Avg Session</p>
                  <p className="text-3xl font-bold text-orange-900">{mockMetrics.avgSessionDuration}m</p>
                  <p className="text-xs text-orange-600 mt-1">+5.7% from last month</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analytics */}
        <Tabs defaultValue="engagement" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl">
            <TabsTrigger value="engagement">User Engagement</TabsTrigger>
            <TabsTrigger value="projects">Project Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Daily Active Users - {getTimeRangeLabel(timeRange)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span>Peak: 489 users</span>
                      <span>Avg: 389 users</span>
                      <span>Low: 245 users</span>
                    </div>
                    <div className="h-32 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-end justify-around p-2">
                      {mockMetrics.dailyActiveUsers.slice(-7).map((value, index) => (
                        <div
                          key={index}
                          className="bg-blue-600 rounded-sm"
                          style={{ height: `${(value / 500) * 100}%`, width: '10px' }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    User Segmentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">New Users</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(mockMetrics.userEngagementMetrics.newUsers / mockMetrics.activeUsers) * 100} className="w-20" />
                        <span className="text-sm font-medium">{mockMetrics.userEngagementMetrics.newUsers}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Returning Users</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(mockMetrics.userEngagementMetrics.returningUsers / mockMetrics.activeUsers) * 100} className="w-20" />
                        <span className="text-sm font-medium">{mockMetrics.userEngagementMetrics.returningUsers}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Churned Users</span>
                      <div className="flex items-center gap-2">
                        <Progress value={(mockMetrics.userEngagementMetrics.churned / mockMetrics.activeUsers) * 100} className="w-20" />
                        <span className="text-sm font-medium">{mockMetrics.userEngagementMetrics.churned}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Projects by Difficulty
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMetrics.projectsByDifficulty.map((item) => (
                      <div key={item.difficulty} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={
                            item.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                            item.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }>
                            {item.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={(item.count / mockMetrics.totalProjects) * 100} className="w-32" />
                          <span className="text-sm font-medium">{item.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Top Performing Projects
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockMetrics.topPerformingProjects.map((project, index) => (
                      <div key={project.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{project.name}</p>
                            <p className="text-xs text-gray-600">{project.completions} completions</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-gray-600">★</span>
                            <span className="text-sm font-medium">{project.avgRating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    System Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Response Time</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">145ms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database Query Time</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">23ms</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Error Rate</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-medium">0.1%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5" />
                    Storage Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Total Data</span>
                      <span className="text-sm font-medium">2.4 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projects Data</span>
                      <span className="text-sm font-medium">1.8 GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">User Data</span>
                      <span className="text-sm font-medium">0.6 GB</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Health Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">API Status</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Database</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Healthy</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">File Storage</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium">Healthy</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Key Insights
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-green-900">High Engagement</p>
                          <p className="text-xs text-green-700">User session duration increased by 15% this month</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900">Popular Templates</p>
                          <p className="text-xs text-blue-700">Customer Churn Prediction is the most completed project</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-yellow-900">Attention Needed</p>
                          <p className="text-xs text-yellow-700">Advanced projects have lower completion rates</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Add More Beginner Content</p>
                      <p className="text-xs text-gray-600">High demand for entry-level projects</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Improve Advanced Project Support</p>
                      <p className="text-xs text-gray-600">Consider adding more guidance for complex projects</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">Expand Real-World Scenarios</p>
                      <p className="text-xs text-gray-600">Users prefer industry-based challenges</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}