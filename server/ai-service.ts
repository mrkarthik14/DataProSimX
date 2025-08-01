import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AIMentorRequest {
  message: string;
  context?: {
    projectTitle?: string;
    currentStep?: string;
    datasetInfo?: any;
    userLevel?: number;
  };
}

export interface ContextualTip {
  type: 'data_upload' | 'data_cleaning' | 'eda' | 'modeling' | 'chart_generation';
  title: string;
  content: string;
  actionable: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface MicroChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  timeLimit: number; // in minutes
  xpReward: number;
  hints: string[];
  expectedAnswer?: string;
  validationCriteria: string[];
}

class AIService {
  private async tryOpenAI<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  private async tryGemini<T>(operation: () => Promise<T>): Promise<T | null> {
    try {
      return await operation();
    } catch (error) {
      console.error('Gemini API error:', error);
      return null;
    }
  }

  async getMentorResponse(request: AIMentorRequest): Promise<string> {
    const systemPrompt = `You are DataProSimX AI Mentor, an expert data science tutor. 
    
    Guidelines:
    - Provide clear, actionable guidance for data science tasks
    - Adapt your language to the user's experience level
    - Focus on practical, hands-on learning
    - Encourage exploration and experimentation
    - Use encouraging but professional tone
    
    Context:
    ${request.context ? `
    - Project: ${request.context.projectTitle || 'Data Analysis Project'}
    - Current Step: ${request.context.currentStep || 'Getting Started'}
    - User Level: ${request.context.userLevel || 1}
    ${request.context.datasetInfo ? `- Dataset: ${JSON.stringify(request.context.datasetInfo)}` : ''}
    ` : ''}`;

    // Try OpenAI first
    const openaiResponse = await this.tryOpenAI(async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: request.message }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });
      return response.choices[0].message.content || "";
    });

    if (openaiResponse) {
      return openaiResponse;
    }

    // Fallback to Gemini
    const geminiResponse = await this.tryGemini(async () => {
      const result = await gemini.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `${systemPrompt}\n\nUser Question: ${request.message}`,
      });
      return result.text || "";
    });

    return geminiResponse || "I'm currently having trouble connecting to AI services. Please try again in a moment, or contact support if the issue persists.";
  }

  async generateContextualTips(context: {
    type: ContextualTip['type'];
    datasetInfo?: any;
    userLevel?: number;
    recentActions?: string[];
  }): Promise<ContextualTip[]> {
    const prompts = {
      data_upload: "Generate 3 actionable tips for someone who just uploaded a dataset for data analysis.",
      data_cleaning: "Generate 3 tips for data cleaning and preprocessing based on common data quality issues.",
      eda: "Generate 3 tips for effective exploratory data analysis and pattern discovery.",
      modeling: "Generate 3 tips for model selection, training, and evaluation best practices.",
      chart_generation: "Generate 3 tips for creating effective data visualizations and charts."
    };

    const systemPrompt = `Generate contextual tips for data science workflow. 
    
    Return a JSON array of exactly 3 tips with this structure:
    [
      {
        "title": "Short actionable title",
        "content": "Detailed explanation (max 100 words)",
        "actionable": true/false,
        "difficulty": "beginner/intermediate/advanced"
      }
    ]
    
    Context: ${context.type}
    User Level: ${context.userLevel || 1}
    ${context.datasetInfo ? `Dataset Info: ${JSON.stringify(context.datasetInfo)}` : ''}`;

    // Try OpenAI first
    const openaiResponse = await this.tryOpenAI(async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompts[context.type] }
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
        temperature: 0.8,
      });
      
      const content = response.choices[0].message.content;
      if (content) {
        const parsed = JSON.parse(content);
        return Array.isArray(parsed) ? parsed : parsed.tips || [];
      }
      return [];
    });

    if (openaiResponse && openaiResponse.length > 0) {
      return openaiResponse.map((tip: any) => ({
        type: context.type,
        title: tip.title,
        content: tip.content,
        actionable: tip.actionable,
        difficulty: tip.difficulty
      }));
    }

    // Fallback to predefined tips
    return this.getFallbackTips(context.type);
  }

  async generateMicroChallenge(context: {
    userLevel: number;
    skillArea: string;
    datasetInfo?: any;
    completedChallenges?: string[];
  }): Promise<MicroChallenge> {
    const bloomLevels = ['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create'];
    const difficulties = ['beginner', 'intermediate', 'advanced'];
    
    // Map user level to difficulty and Bloom's taxonomy
    const difficulty = context.userLevel <= 2 ? 'beginner' : context.userLevel <= 5 ? 'intermediate' : 'advanced';
    const bloomLevel = bloomLevels[Math.min(context.userLevel - 1, bloomLevels.length - 1)];

    const systemPrompt = `Generate a micro-challenge for data science learning.
    
    Return JSON with this exact structure:
    {
      "title": "Challenge title",
      "description": "Clear challenge description with specific task",
      "timeLimit": 5,
      "xpReward": 50,
      "hints": ["hint1", "hint2", "hint3"],
      "expectedAnswer": "expected outcome or approach",
      "validationCriteria": ["criteria1", "criteria2"]
    }
    
    Requirements:
    - Skill Area: ${context.skillArea}
    - Difficulty: ${difficulty}
    - Bloom's Level: ${bloomLevel}
    - User Level: ${context.userLevel}
    ${context.datasetInfo ? `- Dataset Available: ${JSON.stringify(context.datasetInfo)}` : ''}
    
    Make it practical, achievable in 5-15 minutes, and educational.`;

    // Try OpenAI first
    const openaiResponse = await this.tryOpenAI(async () => {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Create a ${difficulty} ${skillArea} challenge focusing on ${bloomLevel} level skills.` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 600,
        temperature: 0.9,
      });
      
      const content = response.choices[0].message.content;
      if (content) {
        return JSON.parse(content);
      }
      return null;
    });

    if (openaiResponse) {
      return {
        id: `challenge_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        title: openaiResponse.title,
        description: openaiResponse.description,
        difficulty: difficulty as any,
        bloomLevel: bloomLevel as any,
        timeLimit: openaiResponse.timeLimit || 10,
        xpReward: openaiResponse.xpReward || 50,
        hints: openaiResponse.hints || [],
        expectedAnswer: openaiResponse.expectedAnswer,
        validationCriteria: openaiResponse.validationCriteria || []
      };
    }

    // Fallback challenge
    return this.getFallbackChallenge(difficulty as any, context.skillArea);
  }

  private getFallbackTips(type: ContextualTip['type']): ContextualTip[] {
    const tipMap = {
      data_upload: [
        {
          type: type as any,
          title: "Check Data Quality First",
          content: "Always examine your dataset for missing values, duplicates, and data types before analysis.",
          actionable: true,
          difficulty: 'beginner' as any
        }
      ],
      data_cleaning: [
        {
          type: type as any,
          title: "Handle Missing Values Strategically",
          content: "Choose appropriate imputation methods based on data type and missingness patterns.",
          actionable: true,
          difficulty: 'intermediate' as any
        }
      ],
      eda: [
        {
          type: type as any,
          title: "Start with Summary Statistics",
          content: "Use describe() and info() to understand your data distribution and basic characteristics.",
          actionable: true,
          difficulty: 'beginner' as any
        }
      ],
      modeling: [
        {
          type: type as any,
          title: "Split Data Before Preprocessing",
          content: "Always split your data into train/test sets before applying transformations to prevent data leakage.",
          actionable: true,
          difficulty: 'intermediate' as any
        }
      ],
      chart_generation: [
        {
          type: type as any,
          title: "Choose the Right Chart Type",
          content: "Use bar charts for categories, line charts for trends, and scatter plots for relationships.",
          actionable: true,
          difficulty: 'beginner' as any
        }
      ]
    };

    return tipMap[type] || [];
  }

  private getFallbackChallenge(difficulty: 'beginner' | 'intermediate' | 'advanced', skillArea: string): MicroChallenge {
    return {
      id: `fallback_${Date.now()}`,
      title: "Data Exploration Challenge",
      description: `Explore your dataset and identify the top 3 most interesting patterns or insights. Document your findings with supporting evidence.`,
      difficulty,
      bloomLevel: 'analyze',
      timeLimit: 10,
      xpReward: 50,
      hints: [
        "Look for correlations between variables",
        "Check for outliers or unusual patterns",
        "Examine the distribution of key variables"
      ],
      expectedAnswer: "Three documented insights with supporting data",
      validationCriteria: [
        "Identified at least 3 patterns",
        "Provided supporting evidence",
        "Used appropriate analysis methods"
      ]
    };
  }
}

export const aiService = new AIService();