import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Play, Square, Download, Trash2, Code } from "lucide-react";

interface PythonExecutorProps {
  initialCode?: string;
  datasetInfo?: {
    filename: string;
    rows: number;
    columns: string[];
  };
}

interface PyodideInterface {
  runPython: (code: string) => string;
  loadPackage: (packages: string[]) => Promise<void>;
  globals: {
    get: (name: string) => any;
    set: (name: string, value: any) => void;
  };
}

declare global {
  interface Window {
    loadPyodide: () => Promise<PyodideInterface>;
  }
}

export default function PythonExecutor({ initialCode = "", datasetInfo }: PythonExecutorProps) {
  const [code, setCode] = useState(initialCode || `# Python Data Analysis
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Sample data analysis
print("Welcome to DataProSimX Python Environment!")
print("Available libraries: pandas, numpy, matplotlib")

# Create sample data
data = {
    'name': ['Alice', 'Bob', 'Charlie', 'Diana'],
    'age': [25, 30, 35, 28],
    'score': [85, 92, 78, 88]
}

df = pd.DataFrame(data)
print("\\nSample DataFrame:")
print(df)
print("\\nBasic statistics:")
print(df.describe())
`);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [pyodide, setPyodide] = useState<PyodideInterface | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);

  // Initialize Pyodide
  useEffect(() => {
    const initPyodide = async () => {
      setIsLoading(true);
      try {
        // Load Pyodide from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = async () => {
          const pyodideInstance = await window.loadPyodide();
          await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib']);
          setPyodide(pyodideInstance);
          setOutput("Python environment loaded successfully! Ready to execute code.\n");
        };
        document.head.appendChild(script);
      } catch (error) {
        setOutput(`Error loading Python environment: ${error}\n`);
      } finally {
        setIsLoading(false);
      }
    };

    initPyodide();
  }, []);

  // Auto-scroll output to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const executeCode = async () => {
    if (!pyodide || isRunning) return;

    setIsRunning(true);
    setOutput(prev => prev + "\n" + "=".repeat(50) + "\n" + "Executing code...\n" + "=".repeat(50) + "\n");

    try {
      // Capture stdout
      pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Execute the user code
      pyodide.runPython(code);

      // Get the captured output
      const stdout = pyodide.runPython("sys.stdout.getvalue()");
      
      setOutput(prev => prev + stdout + "\n");
      
      // Reset stdout
      pyodide.runPython(`
sys.stdout = sys.__stdout__
      `);

    } catch (error) {
      setOutput(prev => prev + `Error: ${error}\n`);
    } finally {
      setIsRunning(false);
    }
  };

  const clearOutput = () => {
    setOutput("");
  };

  const stopExecution = () => {
    setIsRunning(false);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analysis.py';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateDatasetCode = () => {
    if (!datasetInfo) return;

    const datasetCode = `# Load your uploaded dataset: ${datasetInfo.filename}
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Dataset information:
# Filename: ${datasetInfo.filename}
# Rows: ${datasetInfo.rows}
# Columns: ${datasetInfo.columns.join(', ')}

# Create sample data structure based on your dataset
columns = ${JSON.stringify(datasetInfo.columns)}
print(f"Dataset columns: {columns}")
print(f"Total rows: ${datasetInfo.rows}")

# You can work with the column names to create analysis
for col in columns:
    print(f"Column: {col}")

# Example analysis template
print("\\nReady for your data analysis!")
`;

    setCode(datasetCode);
  };

  return (
    <div className="space-y-6">
      {/* Dataset Integration */}
      {datasetInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Code className="w-5 h-5 mr-2" />
              Dataset Integration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">
                  Current dataset: <span className="font-medium">{datasetInfo.filename}</span>
                </p>
                <p className="text-xs text-gray-500">
                  {datasetInfo.rows} rows • {datasetInfo.columns.length} columns
                </p>
              </div>
              <Button onClick={generateDatasetCode} variant="outline" size="sm">
                Generate Code Template
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Code Editor */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Python Code Editor
            </div>
            <div className="flex items-center space-x-2">
              {isLoading && <Badge variant="secondary">Loading Python...</Badge>}
              {pyodide && <Badge variant="default">Python Ready</Badge>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Write your Python code here..."
            className="min-h-[300px] font-mono text-sm"
            disabled={isLoading}
          />
          
          <div className="flex items-center space-x-2">
            <Button 
              onClick={executeCode} 
              disabled={isLoading || isRunning || !pyodide}
              className="flex items-center"
            >
              <Play className="w-4 h-4 mr-2" />
              {isRunning ? "Running..." : "Run Code"}
            </Button>
            
            {isRunning && (
              <Button onClick={stopExecution} variant="destructive" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
            
            <Button onClick={downloadCode} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Output</span>
            <Button onClick={clearOutput} variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={outputRef}
            className="bg-gray-900 text-green-400 p-4 rounded-md font-mono text-sm min-h-[200px] max-h-[400px] overflow-y-auto whitespace-pre-wrap"
          >
            {output || "Output will appear here..."}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}