import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Project } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Play, Download, Share, Code, FileText, Zap } from "lucide-react";

export default function CodeEditor() {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState("notebook");
  const [pythonCode, setPythonCode] = useState(`# DataProSimX - Customer Churn Analysis
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix

# Load the dataset
df = pd.read_csv('telecom_churn.csv')

# Display basic information
print("Dataset shape:", df.shape)
print("\\nFirst 5 rows:")
print(df.head())

# Check for missing values
print("\\nMissing values:")
print(df.isnull().sum())

# Basic statistics
print("\\nBasic statistics:")
print(df.describe())

# Feature engineering
df['tenure_group'] = pd.cut(df['tenure'], bins=[0, 12, 24, 48, 72], labels=['0-12', '13-24', '25-48', '49-72'])
df['charges_per_tenure'] = df['total_charges'] / (df['tenure'] + 1)

# Visualization
plt.figure(figsize=(12, 8))

# Churn distribution
plt.subplot(2, 3, 1)
sns.countplot(data=df, x='churn')
plt.title('Churn Distribution')

# Tenure vs Monthly Charges
plt.subplot(2, 3, 2)
sns.scatterplot(data=df, x='tenure', y='monthly_charges', hue='churn')
plt.title('Tenure vs Monthly Charges')

# Correlation heatmap
plt.subplot(2, 3, 3)
numeric_cols = df.select_dtypes(include=[np.number]).columns
correlation_matrix = df[numeric_cols].corr()
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Feature Correlation')

plt.tight_layout()
plt.show()

# Model training
features = ['tenure', 'monthly_charges', 'total_charges']
X = df[features]
y = df['churn'].map({'Yes': 1, 'No': 0})

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Random Forest model
rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train, y_train)

# Make predictions
y_pred = rf_model.predict(X_test)

# Evaluate the model
print("\\nModel Performance:")
print(classification_report(y_test, y_pred))

# Feature importance
feature_importance = pd.DataFrame({
    'feature': features,
    'importance': rf_model.feature_importances_
}).sort_values('importance', ascending=False)

print("\\nFeature Importance:")
print(feature_importance)

# Generate business insights
print("\\n=== BUSINESS INSIGHTS ===")
print("1. Customers with tenure < 12 months have 47% churn rate")
print("2. Monthly charges > $80 correlate with 23% lower churn")
print("3. Total charges show strong correlation with tenure (r=0.83)")
print("4. Feature importance: monthly_charges (45%), tenure (32%), total_charges (23%)")
`);

  const { data: project } = useQuery<Project>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const executeCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/execute-code`, {
        code: pythonCode,
        language: "python"
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
    },
  });

  const exportCodeMutation = useMutation({
    mutationFn: async (format: string) => {
      const response = await apiRequest("POST", `/api/projects/${projectId}/export-code`, {
        code: pythonCode,
        format
      });
      return response.json();
    },
  });

  const handleExecuteCode = () => {
    executeCodeMutation.mutate();
  };

  const handleExportCode = (format: string) => {
    exportCodeMutation.mutate(format);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Code Editor & Notebook</h1>
              <p className="text-gray-600 mt-2">{project?.title} - Interactive Development Environment</p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Code className="w-3 h-3 mr-1" />
                Python Ready
              </Badge>
              <Button variant="outline" onClick={() => handleExportCode("py")}>
                <Download className="w-4 h-4 mr-2" />
                Export .py
              </Button>
              <Button variant="outline" onClick={() => handleExportCode("ipynb")}>
                <Download className="w-4 h-4 mr-2" />
                Export .ipynb
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Code Editor */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5" />
                    <span>Interactive Notebook</span>
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={handleExecuteCode}
                      disabled={executeCodeMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {executeCodeMutation.isPending ? "Running..." : "Run Code"}
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-100 px-4 py-2 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-600 ml-4">customer_churn_analysis.py</span>
                    </div>
                  </div>
                  <textarea
                    value={pythonCode}
                    onChange={(e) => setPythonCode(e.target.value)}
                    className="w-full h-96 p-4 font-mono text-sm bg-gray-900 text-green-400 resize-none focus:outline-none"
                    placeholder="Write your Python code here..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Code Output */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Execution Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-lg p-4 font-mono text-sm text-green-400 h-64 overflow-y-auto">
                  <div className="text-white mb-2">$ python customer_churn_analysis.py</div>
                  <div className="text-green-400">
                    {executeCodeMutation.isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-400"></div>
                        <span>Executing code...</span>
                      </div>
                    ) : (
                      <>
                        <div>Dataset shape: (10000, 18)</div>
                        <div className="mt-2">First 5 rows:</div>
                        <div className="ml-4 text-gray-300">
                          customer_id  tenure  monthly_charges  total_charges churn<br/>
                          0    CUST_001      24            89.50        2148.00   Yes<br/>
                          1    CUST_002      36            65.20        2347.20    No<br/>
                          2    CUST_003      12            45.30         543.60   Yes<br/>
                          3    CUST_004      48            95.00        4560.00    No<br/>
                          4    CUST_005       6            55.75         334.50   Yes
                        </div>
                        <div className="mt-4">Missing values:</div>
                        <div className="ml-4 text-gray-300">
                          customer_id        0<br/>
                          tenure             0<br/>
                          monthly_charges    0<br/>
                          total_charges      0<br/>
                          churn              0
                        </div>
                        <div className="mt-4 text-yellow-400">Model Performance:</div>
                        <div className="ml-4 text-gray-300">
                          precision    recall  f1-score   support<br/>
                          <br/>
                          0       0.82      0.91      0.86      1456<br/>
                          1       0.64      0.45      0.53       544<br/>
                          <br/>
                          accuracy                           0.79      2000<br/>
                          macro avg       0.73      0.68      0.70      2000<br/>
                          weighted avg    0.77      0.79      0.78      2000
                        </div>
                        <div className="mt-4 text-blue-400">Feature Importance:</div>
                        <div className="ml-4 text-gray-300">
                          monthly_charges    0.452<br/>
                          tenure            0.321<br/>
                          total_charges     0.227
                        </div>
                        <div className="mt-4 text-cyan-400">=== BUSINESS INSIGHTS ===</div>
                        <div className="ml-4 text-gray-300">
                          1. Customers with tenure &lt; 12 months have 47% churn rate<br/>
                          2. Monthly charges &gt; $80 correlate with 23% lower churn<br/>
                          3. Total charges show strong correlation with tenure (r=0.83)<br/>
                          4. Feature importance: monthly_charges (45%), tenure (32%), total_charges (23%)
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Quick Actions</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Code className="w-4 h-4 mr-2" />
                  Code Templates
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Share className="w-4 h-4 mr-2" />
                  Share with Community
                </Button>
              </CardContent>
            </Card>

            {/* Code Templates */}
            <Card>
              <CardHeader>
                <CardTitle>Code Templates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <button
                    onClick={() => setPythonCode(`# Data Exploration Template
import pandas as pd
import numpy as np

# Load data
df = pd.read_csv('your_data.csv')

# Basic info
print(df.info())
print(df.describe())
`)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border"
                  >
                    Data Exploration
                  </button>
                  <button
                    onClick={() => setPythonCode(`# Visualization Template
import matplotlib.pyplot as plt
import seaborn as sns

# Set style
plt.style.use('seaborn')
sns.set_palette("husl")

# Create subplots
fig, axes = plt.subplots(2, 2, figsize=(12, 8))

# Your plots here
plt.show()
`)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border"
                  >
                    Data Visualization
                  </button>
                  <button
                    onClick={() => setPythonCode(`# Machine Learning Template
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report

# Prepare data
X = df.drop('target', axis=1)
y = df['target']

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = RandomForestClassifier()
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))
`)}
                    className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded border"
                  >
                    ML Training
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Execution</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">+50 XP</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Model Training</span>
                    <Badge variant="default" className="bg-blue-100 text-blue-800">+100 XP</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Code Export</span>
                    <Badge variant="secondary">+25 XP</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}