import { type User, type InsertUser, type Project, type InsertProject, type Dataset, type InsertDataset, type Achievement, type InsertAchievement } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  
  // Projects
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUser(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined>;
  
  // Datasets
  getDataset(id: number): Promise<Dataset | undefined>;
  getDatasetsByProject(projectId: number): Promise<Dataset[]>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  
  // Achievements
  getAchievementsByUser(userId: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<number, Project>;
  private datasets: Map<number, Dataset>;
  private achievements: Map<number, Achievement>;
  private nextProjectId: number = 1;
  private nextDatasetId: number = 1;
  private nextAchievementId: number = 1;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.datasets = new Map();
    this.achievements = new Map();
    
    // Create a default user for demo
    this.createDefaultUser();
  }

  private async createDefaultUser() {
    const defaultUser: User = {
      id: "user-1",
      username: "johnsmith",
      password: "password",
      name: "John Smith",
      email: "john@example.com",
      role: "ml_engineer",
      level: 3,
      xp: 2450,
      badges: JSON.parse(JSON.stringify([
        { type: "data_janitor", title: "Data Janitor", earnedAt: new Date() },
        { type: "viz_master", title: "Viz Master", earnedAt: new Date() },
        { type: "model_builder", title: "Model Builder", earnedAt: new Date() }
      ])),
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Create a sample project
    const project: Project = {
      id: 1,
      userId: "user-1",
      title: "Customer Churn Prediction Analysis",
      description: "Telecom industry classification problem",
      type: "classification",
      status: "in_progress",
      currentStep: "eda",
      progress: 65,
      datasetInfo: JSON.parse(JSON.stringify({
        filename: "telecom_churn.csv",
        rows: 10000,
        columns: 18,
        features: ["customer_id", "tenure", "monthly_charges", "total_charges", "churn"]
      })),
      config: JSON.parse(JSON.stringify({})),
      results: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(1, project);
    this.nextProjectId = 2;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      level: 1,
      xp: 0,
      badges: [],
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUser(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId,
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.nextProjectId++;
    const project: Project = {
      ...insertProject,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updates: Partial<Project>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...updates, updatedAt: new Date() };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async getDataset(id: number): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async getDatasetsByProject(projectId: number): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).filter(
      (dataset) => dataset.projectId === projectId,
    );
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = this.nextDatasetId++;
    const dataset: Dataset = {
      ...insertDataset,
      id,
      uploadedAt: new Date(),
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async getAchievementsByUser(userId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(
      (achievement) => achievement.userId === userId,
    );
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.nextAchievementId++;
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      earnedAt: new Date(),
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
