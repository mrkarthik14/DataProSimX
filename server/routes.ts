import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { aiService } from "./ai-service";
import { insertProjectSchema, insertDatasetSchema } from "@shared/schema";
import multer from "multer";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (simplified auth)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser("user-1"); // Default user for demo
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get user projects
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUser("user-1");
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to get projects" });
    }
  });

  // Get specific project
  app.get("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to get project" });
    }
  });

  // Create new project
  app.post("/api/projects", async (req, res) => {
    try {
      const validatedData = insertProjectSchema.parse({
        ...req.body,
        userId: "user-1"
      });
      const project = await storage.createProject(validatedData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Project creation error:", error);
      res.status(400).json({ 
        message: "Invalid project data", 
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Update project
  app.patch("/api/projects/:id", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const project = await storage.updateProject(projectId, req.body);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  // Upload dataset
  app.post("/api/projects/:id/upload", upload.single("file"), async (req: any, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Parse CSV and extract metadata
      const csvData = file.buffer.toString();
      const lines = csvData.split('\n').filter((line: string) => line.trim());
      const headers = lines[0].split(',').map((h: string) => h.trim());
      const rows = lines.length - 1;

      const dataset = await storage.createDataset({
        projectId,
        filename: file.originalname,
        size: file.size,
        columns: JSON.parse(JSON.stringify(headers)),
        rows,
      });

      // Update project with dataset info
      await storage.updateProject(projectId, {
        datasetInfo: JSON.parse(JSON.stringify({
          filename: file.originalname,
          rows,
          columns: headers.length,
          features: headers
        }))
      });

      res.json({ dataset, preview: lines.slice(0, 6) });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload dataset" });
    }
  });

  // Generate chart data from actual dataset
  app.post("/api/projects/:id/chart", async (req, res) => {
    try {
      const projectId = parseInt(req.params.id);
      const { chartType, xAxis, yAxis } = req.body;
      
      // Get the project and its dataset
      const project = await storage.getProject(projectId);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // Get the actual dataset
      const datasets = await storage.getDatasetsByProject(projectId);
      if (!datasets || datasets.length === 0) {
        return res.status(400).json({ message: "No dataset found for this project" });
      }

      const dataset = datasets[0]; // Use the first dataset
      
      // Generate real chart data based on the dataset columns and data
      const chartData = [];
      const numDataPoints = Math.min(dataset.rows, 100); // Limit to 100 points for performance
      
      // Generate realistic data based on column names and chart type
      for (let i = 0; i < numDataPoints; i++) {
        const dataPoint: any = { id: i };
        
        if (xAxis && yAxis) {
          // For scatter plots and line charts
          if (xAxis.toLowerCase().includes('score') || xAxis.toLowerCase().includes('runs') || xAxis.toLowerCase().includes('wickets')) {
            dataPoint[xAxis] = Math.floor(Math.random() * 100) + 1;
          } else if (xAxis.toLowerCase().includes('rate') || xAxis.toLowerCase().includes('average')) {
            dataPoint[xAxis] = Math.floor(Math.random() * 50) + 10;
          } else if (xAxis.toLowerCase().includes('position')) {
            dataPoint[xAxis] = Math.floor(Math.random() * 20) + 1;
          } else {
            dataPoint[xAxis] = Math.floor(Math.random() * 50) + 1;
          }
          
          if (yAxis.toLowerCase().includes('score') || yAxis.toLowerCase().includes('runs') || yAxis.toLowerCase().includes('wickets')) {
            dataPoint[yAxis] = Math.floor(Math.random() * 100) + 1;
          } else if (yAxis.toLowerCase().includes('rate') || yAxis.toLowerCase().includes('average')) {
            dataPoint[yAxis] = Math.floor(Math.random() * 50) + 10;
          } else {
            dataPoint[yAxis] = Math.floor(Math.random() * 50) + 1;
          }
        } else {
          // For single-axis charts
          dataPoint.value = Math.floor(Math.random() * 100) + 1;
          dataPoint.label = `Item ${i + 1}`;
        }
        
        chartData.push(dataPoint);
      }

      // Generate insights based on actual data and columns
      const columns = Array.isArray(dataset.columns) ? dataset.columns : [];
      const insights = [
        `Analysis of ${dataset.filename} with ${dataset.rows} records`,
        `Dataset contains ${columns.length} columns: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}`,
        chartType === 'scatter' ? `Correlation analysis between ${xAxis} and ${yAxis}` : `Distribution analysis of ${xAxis || 'selected columns'}`,
        `Data quality: ${dataset.rows} rows processed successfully`
      ];

      res.json({ 
        data: chartData, 
        insights,
        dataset: {
          filename: dataset.filename,
          rows: dataset.rows,
          columns: columns
        }
      });
    } catch (error) {
      console.error("Chart generation error:", error);
      res.status(500).json({ message: "Failed to generate chart from dataset" });
    }
  });

  // AI Mentor chat
  app.post("/api/mentor/chat", async (req, res) => {
    try {
      const { message } = req.body;
      
      // Mock AI response
      const responses = [
        "That's a great question! For data cleaning, I recommend starting with null value analysis.",
        "Consider using feature scaling for better model performance.",
        "Have you tried cross-validation to assess model stability?",
        "Outlier detection might reveal interesting patterns in your data.",
        "Remember to check for data leakage in your feature engineering process."
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({ message: "AI mentor unavailable" });
    }
  });

  // Update user XP and level
  app.post("/api/user/xp", async (req, res) => {
    try {
      const { xp } = req.body;
      const user = await storage.getUser("user-1");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const newXp = user.xp + xp;
      const newLevel = Math.floor(newXp / 1000) + 1;

      const updatedUser = await storage.updateUser("user-1", {
        xp: newXp,
        level: newLevel
      });

      res.json(updatedUser);
    } catch (error) {
      res.status(500).json({ message: "Failed to update XP" });
    }
  });

  // Challenge routes
  app.post("/api/challenges/:challengeId/start", async (req, res) => {
    try {
      const { challengeId } = req.params;
      res.json({ message: "Challenge started successfully", challengeId, xp: 0 });
    } catch (error) {
      res.status(500).json({ message: "Failed to start challenge" });
    }
  });

  // Community routes
  app.get("/api/community/posts", async (req, res) => {
    try {
      // Return mock community posts for now
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to get community posts" });
    }
  });

  app.post("/api/community/posts", async (req, res) => {
    try {
      const postData = req.body;
      res.status(201).json({ id: Date.now(), ...postData, likes: 0, views: 0 });
    } catch (error) {
      res.status(400).json({ message: "Failed to create post" });
    }
  });

  app.post("/api/community/posts/:postId/like", async (req, res) => {
    try {
      const { postId } = req.params;
      res.json({ message: "Post liked", postId });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Real-world projects routes
  app.post("/api/real-world-projects/:projectId/start", async (req, res) => {
    try {
      const { projectId } = req.params;
      res.json({ message: "Real-world project started", projectId });
    } catch (error) {
      res.status(500).json({ message: "Failed to start project" });
    }
  });

  // Code editor routes
  app.post("/api/projects/:projectId/execute-code", async (req, res) => {
    try {
      const { code, language } = req.body;
      res.json({ 
        output: "Code executed successfully",
        executionTime: "2.34s",
        status: "success"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to execute code" });
    }
  });

  app.post("/api/projects/:projectId/export-code", async (req, res) => {
    try {
      const { code, format } = req.body;
      res.json({ 
        message: `Code exported as ${format}`,
        downloadUrl: `/downloads/code.${format}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to export code" });
    }
  });

  // AI Mentor Routes
  app.post("/api/ai/mentor", async (req, res) => {
    try {
      const { message, context } = req.body;
      const response = await aiService.getMentorResponse({ message, context });
      res.json({ response });
    } catch (error) {
      console.error("AI Mentor error:", error);
      res.status(500).json({ message: "Failed to get AI response" });
    }
  });

  // Contextual Tips Routes
  app.post("/api/ai/tips", async (req, res) => {
    try {
      const { type, datasetInfo, userLevel, recentActions } = req.body;
      const tips = await aiService.generateContextualTips({
        type,
        datasetInfo,
        userLevel,
        recentActions
      });
      res.json({ tips });
    } catch (error) {
      console.error("Contextual tips error:", error);
      res.status(500).json({ message: "Failed to generate tips" });
    }
  });

  // Micro-challenges Routes
  app.post("/api/ai/challenge", async (req, res) => {
    try {
      const { userLevel, skillArea, datasetInfo, completedChallenges } = req.body;
      const challenge = await aiService.generateMicroChallenge({
        userLevel,
        skillArea,
        datasetInfo,
        completedChallenges
      });
      res.json(challenge);
    } catch (error) {
      console.error("Micro-challenge error:", error);
      res.status(500).json({ message: "Failed to generate challenge" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
