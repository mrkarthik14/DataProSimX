import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import PythonExecutor from "@/components/python-executor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, FileText, Zap } from "lucide-react";

export default function CodeEditor() {
  const { projectId } = useParams();

  // Get project data to access dataset info
  const { data: project } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const initialCode = `# DataProSimX - Data Analysis Notebook
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Welcome to the Python data analysis environment!
print("🚀 DataProSimX Python Environment Ready")
print("Available libraries: pandas, numpy, matplotlib")

# Create sample analysis
print("\\n📊 Sample Data Analysis:")
data = {
    'feature1': [1, 2, 3, 4, 5],
    'feature2': [10, 20, 30, 40, 50],
    'target': [0, 1, 0, 1, 1]
}

df = pd.DataFrame(data)
print("Dataset shape:", df.shape)
print("\\nFirst few rows:")
print(df.head())

# Basic statistics
print("\\n📈 Statistical Summary:")
print(df.describe())

# Simple analysis
correlation = df['feature1'].corr(df['feature2'])
print(f"\\n🔗 Correlation between feature1 and feature2: {correlation:.3f}")

print("\\n✅ Analysis complete! Ready for your code.")
`;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Code Editor</h1>
              <p className="text-gray-600 mt-2">
                Interactive Python notebook for data analysis and machine learning
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                Pyodide Runtime
              </Badge>
              {project && (
                <Badge variant="outline">
                  Project: {project.title}
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="notebook" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notebook" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Python Notebook
            </TabsTrigger>
            <TabsTrigger value="documentation" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Documentation
            </TabsTrigger>
            <TabsTrigger value="examples" className="flex items-center">
              <Zap className="w-4 h-4 mr-2" />
              Examples
            </TabsTrigger>
          </TabsList>

          {/* Python Notebook Tab */}
          <TabsContent value="notebook">
            <PythonExecutor 
              initialCode={initialCode}
              datasetInfo={project?.datasetInfo ? {
                filename: (project.datasetInfo as any).filename,
                rows: (project.datasetInfo as any).rows,
                columns: (project.datasetInfo as any).columns || []
              } : undefined}
            />
          </TabsContent>

          {/* Documentation Tab */}
          <TabsContent value="documentation">
            <Card>
              <CardHeader>
                <CardTitle>Python Environment Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Available Libraries</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li><strong>pandas</strong> - Data manipulation and analysis</li>
                    <li><strong>numpy</strong> - Numerical computing</li>
                    <li><strong>matplotlib</strong> - Data visualization</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
                  <ol className="list-decimal list-inside space-y-1 text-gray-700">
                    <li>Write your Python code in the editor</li>
                    <li>Click "Run Code" to execute</li>
                    <li>View results in the output panel</li>
                    <li>Use the dataset integration to work with uploaded data</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">Dataset Integration</h3>
                  <p className="text-gray-700">
                    If you have uploaded a dataset in the simulation, click "Generate Code Template" 
                    to get started with analysis code that uses your actual data columns.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples Tab */}
          <TabsContent value="examples">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Data Loading Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import pandas as pd
import numpy as np

# Create sample dataset
data = {
    'name': ['Alice', 'Bob', 'Charlie'],
    'age': [25, 30, 35],
    'score': [85, 92, 78]
}

df = pd.DataFrame(data)
print(df)
print("\\nDataset info:")
print(df.info())`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Basic Analysis Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`# Statistical analysis
print("Basic statistics:")
print(df.describe())

# Correlation analysis
correlation = df['age'].corr(df['score'])
print(f"Age-Score correlation: {correlation:.3f}")

# Grouping and aggregation
avg_score = df.groupby('name')['score'].mean()
print("\\nAverage scores:")
print(avg_score)`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Visualization Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import matplotlib.pyplot as plt

# Create a simple plot
plt.figure(figsize=(8, 6))
plt.scatter(df['age'], df['score'])
plt.xlabel('Age')
plt.ylabel('Score')
plt.title('Age vs Score')
plt.grid(True)

# Note: In Pyodide, plots may not display
# but you can still generate them
print("Plot created successfully!")`}
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Machine Learning Example</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
{`import numpy as np

# Simple linear regression calculation
def simple_linear_regression(x, y):
    n = len(x)
    sum_x = sum(x)
    sum_y = sum(y)
    sum_xy = sum(x[i] * y[i] for i in range(n))
    sum_x2 = sum(x[i] ** 2 for i in range(n))
    
    slope = (n * sum_xy - sum_x * sum_y) / (n * sum_x2 - sum_x ** 2)
    intercept = (sum_y - slope * sum_x) / n
    
    return slope, intercept

# Example usage
x = [1, 2, 3, 4, 5]
y = [2, 4, 6, 8, 10]
slope, intercept = simple_linear_regression(x, y)
print(f"Slope: {slope}, Intercept: {intercept}")`}
                  </pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}