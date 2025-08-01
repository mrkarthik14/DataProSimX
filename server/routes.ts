import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
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

  // Generate chart data
  app.post("/api/projects/:id/chart", async (req, res) => {
    try {
      const { chartType, xAxis, yAxis } = req.body;
      
      // Mock chart data generation
      const mockData = [];
      for (let i = 0; i < 50; i++) {
        mockData.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          category: Math.random() > 0.5 ? 'A' : 'B'
        });
      }

      const insights = [
        `Strong correlation between ${xAxis} and ${yAxis} (r=0.83)`,
        `${xAxis} values show normal distribution`,
        `Outliers detected in ${yAxis} (5% of data points)`,
      ];

      res.json({ data: mockData, insights });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate chart" });
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

  const httpServer = createServer(app);
  return httpServer;
}
