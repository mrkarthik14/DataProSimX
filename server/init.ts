import { storage } from "./storage";

export async function initializeDefaultData() {
  try {
    // Check if default user exists
    const existingUser = await storage.getUser("user-1");
    
    if (!existingUser) {
      // Create default demo user
      await storage.createUser({
        username: "demo_user",
        password: "password123",
        name: "Demo User",
        email: "demo@dataprosimlx.com",
        role: "data_analyst",
        level: 1,
        xp: 0,
        badges: []
      });
      console.log("✓ Default user created");
    } else {
      console.log("✓ Default user already exists");
    }
  } catch (error) {
    console.error("Failed to initialize default data:", error);
  }
}