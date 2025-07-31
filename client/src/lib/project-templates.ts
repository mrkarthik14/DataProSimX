export interface ProjectTemplate {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  domain: string;
  tools: string[];
  objectives: string[];
  datasets: {
    name: string;
    description: string;
    rows: number;
    columns: string[];
  }[];
  steps: {
    title: string;
    description: string;
    expectedOutput: string;
  }[];
  badge?: string;
  xpReward: number;
}

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'customer-churn-prediction',
    title: 'Customer Churn Prediction',
    description: 'Build a machine learning model to predict which customers are likely to churn based on their usage patterns and demographics.',
    difficulty: 'Intermediate',
    estimatedTime: '4-6 hours',
    domain: 'Business Analytics',
    tools: ['pandas', 'scikit-learn', 'matplotlib', 'seaborn'],
    objectives: [
      'Analyze customer behavior patterns',
      'Build and evaluate classification models',
      'Create actionable business insights',
      'Generate executive summary report'
    ],
    datasets: [
      {
        name: 'telecom_customer_data.csv',
        description: 'Customer demographics, service usage, and churn status',
        rows: 7043,
        columns: ['customer_id', 'tenure', 'monthly_charges', 'total_charges', 'churn', 'contract_type', 'payment_method']
      }
    ],
    steps: [
      {
        title: 'Exploratory Data Analysis',
        description: 'Analyze customer demographics and identify patterns in churned vs retained customers',
        expectedOutput: 'Statistical summary and visualization of key customer segments'
      },
      {
        title: 'Feature Engineering',
        description: 'Create new features like customer lifetime value, usage trends, and risk scores',
        expectedOutput: 'Enhanced dataset with engineered features ready for modeling'
      },
      {
        title: 'Model Development',
        description: 'Train and evaluate multiple classification algorithms (Logistic Regression, Random Forest, XGBoost)',
        expectedOutput: 'Trained models with performance metrics and feature importance analysis'
      },
      {
        title: 'Business Impact Analysis',
        description: 'Calculate potential revenue savings and create retention strategy recommendations',
        expectedOutput: 'Executive dashboard with ROI projections and actionable insights'
      }
    ],
    badge: 'Customer Retention Expert',
    xpReward: 500
  },
  {
    id: 'fraud-detection-system',
    title: 'Credit Card Fraud Detection',
    description: 'Develop an advanced fraud detection system using machine learning to identify suspicious transactions in real-time.',
    difficulty: 'Advanced',
    estimatedTime: '6-8 hours',
    domain: 'Finance & Security',
    tools: ['pandas', 'scikit-learn', 'imbalanced-learn', 'plotly', 'SHAP'],
    objectives: [
      'Handle highly imbalanced datasets',
      'Build robust anomaly detection models',
      'Optimize for precision and recall',
      'Create real-time scoring pipeline'
    ],
    datasets: [
      {
        name: 'credit_card_transactions.csv',
        description: 'Anonymized credit card transactions with fraud labels',
        rows: 284807,
        columns: ['time', 'v1', 'v2', 'v3', 'v4', 'v5', 'amount', 'class']
      }
    ],
    steps: [
      {
        title: 'Imbalanced Data Analysis',
        description: 'Understand the fraud rate and transaction patterns using advanced visualization techniques',
        expectedOutput: 'Comprehensive fraud pattern analysis with temporal and amount-based insights'
      },
      {
        title: 'Advanced Sampling Techniques',
        description: 'Apply SMOTE, ADASYN, and ensemble methods to handle class imbalance',
        expectedOutput: 'Balanced training datasets with validated sampling strategies'
      },
      {
        title: 'Ensemble Model Development',
        description: 'Build and tune ensemble models optimized for fraud detection metrics',
        expectedOutput: 'High-performance fraud detection model with 99%+ accuracy and low false positives'
      },
      {
        title: 'Model Explainability & Deployment',
        description: 'Create SHAP explanations and design real-time scoring architecture',
        expectedOutput: 'Deployable fraud detection system with interpretable predictions'
      }
    ],
    badge: 'Fraud Detection Master',
    xpReward: 750
  },
  {
    id: 'sales-forecasting-dashboard',
    title: 'Sales Forecasting Dashboard',
    description: 'Build an interactive time series forecasting system to predict sales and optimize inventory management.',
    difficulty: 'Intermediate',
    estimatedTime: '5-7 hours',
    domain: 'Supply Chain & Operations',
    tools: ['pandas', 'prophet', 'plotly', 'streamlit', 'statsmodels'],
    objectives: [
      'Master time series analysis techniques',
      'Build accurate forecasting models',
      'Create interactive business dashboards',
      'Optimize inventory recommendations'
    ],
    datasets: [
      {
        name: 'retail_sales_data.csv',
        description: 'Historical sales data with seasonal patterns',
        rows: 45000,
        columns: ['date', 'store_id', 'product_category', 'sales', 'inventory', 'promotions']
      }
    ],
    steps: [
      {
        title: 'Time Series Exploration',
        description: 'Analyze seasonal patterns, trends, and anomalies in sales data',
        expectedOutput: 'Seasonal decomposition analysis and trend identification'
      },
      {
        title: 'Forecasting Model Development',
        description: 'Implement ARIMA, Prophet, and ensemble forecasting methods',
        expectedOutput: 'Validated forecasting models with accuracy metrics and confidence intervals'
      },
      {
        title: 'Interactive Dashboard Creation',
        description: 'Build real-time forecasting dashboard with scenario planning capabilities',
        expectedOutput: 'Interactive Plotly/Streamlit dashboard for business stakeholders'
      },
      {
        title: 'Inventory Optimization',
        description: 'Develop automated inventory recommendations based on forecasts',
        expectedOutput: 'Optimization algorithm with cost-benefit analysis and safety stock calculations'
      }
    ],
    badge: 'Forecasting Specialist',
    xpReward: 600
  },
  {
    id: 'nlp-sentiment-analysis',
    title: 'Social Media Sentiment Analysis',
    description: 'Build an NLP pipeline to analyze customer sentiment from social media data and product reviews.',
    difficulty: 'Intermediate',
    estimatedTime: '4-5 hours',
    domain: 'Marketing & NLP',
    tools: ['pandas', 'nltk', 'transformers', 'wordcloud', 'textblob'],
    objectives: [
      'Master text preprocessing techniques',
      'Build sentiment classification models',
      'Create insightful text visualizations',
      'Generate actionable marketing insights'
    ],
    datasets: [
      {
        name: 'social_media_posts.csv',
        description: 'Customer posts and reviews with metadata',
        rows: 25000,
        columns: ['post_id', 'text', 'platform', 'timestamp', 'likes', 'shares', 'sentiment']
      }
    ],
    steps: [
      {
        title: 'Text Data Preprocessing',
        description: 'Clean, tokenize, and prepare text data for analysis',
        expectedOutput: 'Preprocessed text corpus with feature extraction pipeline'
      },
      {
        title: 'Sentiment Model Development',
        description: 'Train BERT-based and traditional ML sentiment classifiers',
        expectedOutput: 'High-accuracy sentiment classification model with performance metrics'
      },
      {
        title: 'Topic Modeling & Insights',
        description: 'Discover key themes and topics using LDA and clustering techniques',
        expectedOutput: 'Topic analysis with word clouds and thematic insights'
      },
      {
        title: 'Marketing Intelligence Report',
        description: 'Create actionable insights and recommendations for marketing teams',
        expectedOutput: 'Executive report with sentiment trends and marketing recommendations'
      }
    ],
    badge: 'NLP Analytics Expert',
    xpReward: 550
  }
];

export const getTemplateById = (id: string): ProjectTemplate | undefined => {
  return PROJECT_TEMPLATES.find(template => template.id === id);
};

export const getTemplatesByDifficulty = (difficulty: ProjectTemplate['difficulty']): ProjectTemplate[] => {
  return PROJECT_TEMPLATES.filter(template => template.difficulty === difficulty);
};

export const getTemplatesByDomain = (domain: string): ProjectTemplate[] => {
  return PROJECT_TEMPLATES.filter(template => template.domain === domain);
};