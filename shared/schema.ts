import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  role: text("role").notNull().default("data_analyst"),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  badges: jsonb("badges").default('[]'),
  createdAt: timestamp("created_at").defaultNow(),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(), // classification, regression, clustering, etc.
  status: text("status").notNull().default("in_progress"), // in_progress, completed, paused
  currentStep: text("current_step").notNull().default("data_ingestion"),
  progress: integer("progress").notNull().default(0),
  datasetInfo: jsonb("dataset_info"),
  config: jsonb("config").default('{}'),
  results: jsonb("results"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const datasets = pgTable("datasets", {
  id: serial("id").primaryKey(),
  projectId: integer("project_id").notNull().references(() => projects.id),
  filename: text("filename").notNull(),
  size: integer("size").notNull(),
  columns: jsonb("columns").notNull(),
  rows: integer("rows").notNull(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  badgeType: text("badge_type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  earnedAt: timestamp("earned_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  challengeId: text("challenge_id").notNull(),
  status: text("status").notNull().default("available"), // available, in_progress, completed
  progress: integer("progress").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").references(() => projects.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  type: text("type").notNull(), // insight, result, question, showcase
  tags: jsonb("tags").default('[]'),
  likes: integer("likes").notNull().default(0),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communityComments = pgTable("community_comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  likes: integer("likes").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const portfolioProjects = pgTable("portfolio_projects", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  projectId: integer("project_id").notNull().references(() => projects.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  insights: jsonb("insights").default('[]'),
  skills: jsonb("skills").default('[]'),
  isPublic: boolean("is_public").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDatasetSchema = createInsertSchema(datasets).omit({
  id: true,
  uploadedAt: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  earnedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCommunityCommentSchema = createInsertSchema(communityComments).omit({
  id: true,
  createdAt: true,
});

export const insertPortfolioProjectSchema = createInsertSchema(portfolioProjects).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;
export type InsertDataset = z.infer<typeof insertDatasetSchema>;
export type Dataset = typeof datasets.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type Challenge = typeof challenges.$inferSelect;
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;
export type InsertCommunityComment = z.infer<typeof insertCommunityCommentSchema>;
export type CommunityComment = typeof communityComments.$inferSelect;
export type InsertPortfolioProject = z.infer<typeof insertPortfolioProjectSchema>;
export type PortfolioProject = typeof portfolioProjects.$inferSelect;
