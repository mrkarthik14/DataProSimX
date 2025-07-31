export const mockDataset = [
  {
    customer_id: "CUST_001",
    tenure: 24,
    monthly_charges: 89.50,
    total_charges: 2148.00,
    churn: "Yes"
  },
  {
    customer_id: "CUST_002", 
    tenure: 36,
    monthly_charges: 65.20,
    total_charges: 2347.20,
    churn: "No"
  },
  {
    customer_id: "CUST_003",
    tenure: 12,
    monthly_charges: 45.30,
    total_charges: 543.60,
    churn: "Yes"
  },
  {
    customer_id: "CUST_004",
    tenure: 48,
    monthly_charges: 95.00,
    total_charges: 4560.00,
    churn: "No"
  },
  {
    customer_id: "CUST_005",
    tenure: 6,
    monthly_charges: 55.75,
    total_charges: 334.50,
    churn: "Yes"
  }
];

export const mockChartData = {
  scatter: [
    { x: 24, y: 89.50, category: "Churned" },
    { x: 36, y: 65.20, category: "Retained" },
    { x: 12, y: 45.30, category: "Churned" },
    { x: 48, y: 95.00, category: "Retained" },
    { x: 6, y: 55.75, category: "Churned" },
  ],
  insights: [
    "Strong correlation between tenure and total charges (r=0.83)",
    "Customers with tenure < 12 months show 47% churn rate", 
    "Monthly charges above $80 correlate with higher retention",
    "Premium customers (>$90/month) have 15% lower churn",
  ]
};
