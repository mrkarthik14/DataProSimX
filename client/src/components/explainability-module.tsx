import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Target,
  BarChart3,
  Lightbulb,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface FeatureImportance {
  feature: string;
  importance: number;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

interface ModelExplanation {
  prediction: number;
  confidence: number;
  topFeatures: FeatureImportance[];
  shap_values: { feature: string; value: number }[];
  business_insights: string[];
}

interface ExplainabilityModuleProps {
  projectId: number;
  modelType: string;
  onClose?: () => void;
}

export default function ExplainabilityModule({ projectId, modelType, onClose }: ExplainabilityModuleProps) {
  const [selectedSample, setSelectedSample] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock model explanation data
  const explanation: ModelExplanation = {
    prediction: 0.73,
    confidence: 0.89,
    topFeatures: [
      {
        feature: "monthly_charges",
        importance: 0.452,
        impact: "negative",
        description: "Higher monthly charges (>$80) strongly indicate customer retention. This customer pays $95/month, reducing churn probability by 22%."
      },
      {
        feature: "tenure",
        importance: 0.321,
        impact: "negative",
        description: "Customer tenure of 48 months provides strong loyalty signal. Long-term customers have 67% lower churn rate."
      },
      {
        feature: "total_charges",
        importance: 0.227,
        impact: "negative",
        description: "Total charges of $4,560 indicate significant customer lifetime value and investment in the service."
      },
      {
        feature: "contract_type",
        importance: 0.189,
        impact: "positive",
        description: "Month-to-month contract increases churn risk by 34% compared to annual contracts."
      },
      {
        feature: "payment_method",
        importance: 0.156,
        impact: "positive",
        description: "Electronic check payment method correlates with 18% higher churn rate vs automatic payments."
      }
    ],
    shap_values: [
      { feature: "monthly_charges", value: -0.22 },
      { feature: "tenure", value: -0.18 },
      { feature: "total_charges", value: -0.12 },
      { feature: "contract_type", value: +0.15 },
      { feature: "payment_method", value: +0.08 },
      { feature: "tech_support", value: -0.05 },
      { feature: "online_security", value: -0.03 },
      { feature: "device_protection", value: +0.02 }
    ],
    business_insights: [
      "This customer has strong retention indicators (high monthly charges, long tenure) but risky contract terms (month-to-month).",
      "Recommendation: Offer contract upgrade incentive to reduce churn risk from 73% to ~45%.",
      "The payment method (electronic check) suggests potential billing friction - consider promoting automatic payment with discount.",
      "High-value customer ($95/month) - prioritize for retention program with personalized offers.",
      "Customer satisfaction appears high (long tenure + high charges) - leverage for testimonials or referrals."
    ]
  };

  const sampleCustomers = [
    { id: 1, name: "Customer #1247", risk: "High", prediction: 0.73 },
    { id: 2, name: "Customer #8952", risk: "Low", prediction: 0.23 },
    { id: 3, name: "Customer #4561", risk: "Medium", prediction: 0.48 },
  ];

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case "positive": return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "negative": return <TrendingDown className="w-4 h-4 text-green-500" />;
      default: return <Target className="w-4 h-4 text-gray-500" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive": return "text-red-600";
      case "negative": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Model Explainability</h2>
            <p className="text-gray-600 text-sm">Understanding {modelType} predictions with SHAP analysis</p>
          </div>
        </div>
        {onClose && (
          <Button variant="outline" onClick={onClose}>Close</Button>
        )}
      </div>

      {/* Sample Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="w-5 h-5" />
            <span>Select Sample for Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sampleCustomers.map((customer, index) => (
              <button
                key={customer.id}
                onClick={() => setSelectedSample(index)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedSample === index
                    ? "border-primary bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{customer.name}</span>
                  <Badge className={getRiskColor(customer.risk)}>
                    {customer.risk} Risk
                  </Badge>
                </div>
                <div className="text-sm text-gray-600">
                  Churn Probability: {(customer.prediction * 100).toFixed(1)}%
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Explainability Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Feature Impact</TabsTrigger>
          <TabsTrigger value="shap">SHAP Values</TabsTrigger>
          <TabsTrigger value="insights">Business Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Churn Prediction</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {(explanation.prediction * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">High Risk</div>
                <Progress value={explanation.prediction * 100} className="mt-4" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Model Confidence</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {(explanation.confidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Very Confident</div>
                <div className="flex items-center justify-center mt-4">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-center">Key Factors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {explanation.topFeatures.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{feature.feature}</span>
                      <div className="flex items-center space-x-1">
                        {getImpactIcon(feature.impact)}
                        <span className={`text-sm ${getImpactColor(feature.impact)}`}>
                          {(feature.importance * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5" />
                <span>Feature Importance Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {explanation.topFeatures.map((feature, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{feature.feature}</span>
                        {getImpactIcon(feature.impact)}
                      </div>
                      <Badge variant="outline">
                        {(feature.importance * 100).toFixed(1)}% importance
                      </Badge>
                    </div>
                    <Progress value={feature.importance * 100} className="mb-3" />
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shap" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5" />
                <span>SHAP Value Analysis</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Understanding SHAP Values</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    SHAP values show how each feature contributes to moving the prediction away from the baseline. 
                    Positive values increase churn risk, negative values decrease it.
                  </p>
                </div>

                <div className="space-y-3">
                  {explanation.shap_values.map((shap, index) => (
                    <div key={index} className="flex items-center space-x-4 p-3 bg-white border rounded-lg">
                      <div className="flex-1">
                        <span className="font-medium">{shap.feature}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          shap.value > 0 ? "bg-red-500" : "bg-green-500"
                        }`}></div>
                        <span className={`text-sm font-mono ${
                          shap.value > 0 ? "text-red-600" : "text-green-600"
                        }`}>
                          {shap.value > 0 ? "+" : ""}{shap.value.toFixed(3)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">Interpretation</span>
                  </div>
                  <p className="text-xs text-gray-700">
                    Sum of SHAP values: {explanation.shap_values.reduce((sum, shap) => sum + shap.value, 0).toFixed(3)} 
                    = Final prediction offset from baseline
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5" />
                <span>AI-Generated Business Insights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {explanation.business_insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">{index + 1}</span>
                    </div>
                    <p className="text-sm text-gray-700">{insight}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-800">Recommended Actions</span>
                </div>
                <ul className="space-y-1 text-sm text-green-700">
                  <li>• Contact customer within 48 hours with retention offer</li>
                  <li>• Propose annual contract with 15% discount</li>
                  <li>• Set up automatic payment method</li>
                  <li>• Assign to high-value customer success manager</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}