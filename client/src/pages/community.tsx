import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, CommunityPost } from "@shared/schema";
import Navigation from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  MessageSquare, 
  Heart, 
  Eye, 
  Share, 
  Filter, 
  Plus,
  TrendingUp,
  Users,
  Award,
  Clock,
  Tag
} from "lucide-react";

export default function Community() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    type: "insight",
    tags: [] as string[],
  });

  const { data: user } = useQuery<User>({
    queryKey: ["/api/user"],
  });

  // Mock community posts data
  const communityPosts: (CommunityPost & { author: User; comments: number })[] = [
    {
      id: 1,
      userId: "user-1",
      projectId: 1,
      title: "Discovered Strong Correlation Between Tenure and Churn Rate",
      content: "After analyzing 10,000 telecom customers, I found that customers with tenure < 12 months have a 47% churn rate compared to 18% for customers with 24+ months tenure. This suggests early customer retention programs could be highly effective.\n\nKey insights:\n- Month 6-12 is critical retention period\n- Premium customers (>$80/month) have 23% lower churn\n- Seasonal patterns show higher churn in Q1\n\nWhat retention strategies have worked for your models?",
      type: "insight",
      tags: ["churn-analysis", "telecom", "retention", "correlation"],
      likes: 24,
      views: 156,
      createdAt: new Date("2024-01-28"),
      updatedAt: new Date("2024-01-28"),
      author: {
        id: "user-1",
        username: "johnsmith",
        name: "John Smith",
        email: "john@example.com",
        role: "ml_engineer",
        level: 3,
        xp: 2450,
        badges: [],
        password: "",
        createdAt: new Date(),
      },
      comments: 8,
    },
    {
      id: 2,
      userId: "user-2",
      projectId: null,
      title: "Random Forest vs XGBoost: Performance Comparison on Imbalanced Dataset",
      content: "Tested both algorithms on a fraud detection dataset (95% normal, 5% fraud). Results were surprising!\n\n**Random Forest:**\n- Accuracy: 94.2%\n- Precision: 0.73\n- Recall: 0.68\n- F1-Score: 0.70\n\n**XGBoost:**\n- Accuracy: 96.1%\n- Precision: 0.81\n- Recall: 0.74\n- F1-Score: 0.77\n\nXGBoost clearly wins, but Random Forest was much faster to train. For real-time systems, the speed difference matters.\n\nAnyone tried ensemble methods for similar problems?",
      type: "result",
      tags: ["machine-learning", "random-forest", "xgboost", "imbalanced-data"],
      likes: 31,
      views: 203,
      createdAt: new Date("2024-01-27"),
      updatedAt: new Date("2024-01-27"),
      author: {
        id: "user-2",
        username: "sarahchen",
        name: "Sarah Chen",
        email: "sarah@example.com",
        role: "data_analyst",
        level: 2,
        xp: 1850,
        badges: [],
        password: "",
        createdAt: new Date(),
      },
      comments: 12,
    },
    {
      id: 3,
      userId: "user-3",
      projectId: 3,
      title: "Help: Model Overfitting Despite Regularization",
      content: "I'm working on a customer segmentation problem with 50 features and 5,000 samples. My Random Forest model shows:\n\n- Training accuracy: 98.5%\n- Validation accuracy: 72.3%\n\nClear overfitting! I've tried:\n- Reducing max_depth to 5\n- Increasing min_samples_split to 20\n- Feature selection (removed 20 features)\n- Cross-validation with 5 folds\n\nStill getting massive overfitting. What am I missing? Could it be data leakage?",
      type: "question",
      tags: ["overfitting", "random-forest", "regularization", "help-needed"],
      likes: 18,
      views: 89,
      createdAt: new Date("2024-01-26"),
      updatedAt: new Date("2024-01-26"),
      author: {
        id: "user-3",
        username: "alexkim",
        name: "Alex Kim",
        email: "alex@example.com",
        role: "data_engineer",
        level: 1,
        xp: 750,
        badges: [],
        password: "",
        createdAt: new Date(),
      },
      comments: 15,
    },
  ];

  const createPostMutation = useMutation({
    mutationFn: async (postData: typeof newPost) => {
      const response = await apiRequest("POST", "/api/community/posts", postData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/community/posts"] });
      setShowCreatePost(false);
      setNewPost({ title: "", content: "", type: "insight", tags: [] });
    },
  });

  const likePostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const response = await apiRequest("POST", `/api/community/posts/${postId}/like`, {});
      return response.json();
    },
  });

  const filters = [
    { id: "all", label: "All Posts", icon: MessageSquare },
    { id: "insight", label: "Insights", icon: TrendingUp },
    { id: "result", label: "Results", icon: Award },
    { id: "question", label: "Questions", icon: MessageSquare },
    { id: "showcase", label: "Showcase", icon: Users },
  ];

  const filteredPosts = activeFilter === "all" 
    ? communityPosts 
    : communityPosts.filter(post => post.type === activeFilter);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "insight": return "bg-blue-100 text-blue-800";
      case "result": return "bg-green-100 text-green-800";
      case "question": return "bg-orange-100 text-orange-800";
      case "showcase": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelBadge = (level: number) => {
    if (level >= 5) return { color: "bg-purple-100 text-purple-800", label: "Expert" };
    if (level >= 3) return { color: "bg-blue-100 text-blue-800", label: "Advanced" };
    if (level >= 2) return { color: "bg-green-100 text-green-800", label: "Intermediate" };
    return { color: "bg-gray-100 text-gray-800", label: "Beginner" };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Community Forum</h1>
              <p className="text-gray-600 mt-2">Share insights, get feedback, and learn from fellow data scientists</p>
            </div>
            <Button onClick={() => setShowCreatePost(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Post
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filters.map((filter) => {
                    const IconComponent = filter.icon;
                    const filterCount = filter.id === "all" 
                      ? communityPosts.length 
                      : communityPosts.filter(p => p.type === filter.id).length;
                    
                    return (
                      <button
                        key={filter.id}
                        onClick={() => setActiveFilter(filter.id)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                          activeFilter === filter.id
                            ? "bg-primary text-white border-primary"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="text-sm font-medium">{filter.label}</span>
                        </div>
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                          {filterCount}
                        </Badge>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Community Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Community Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Posts</span>
                    <span className="font-medium">847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Members</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-medium">23 posts</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Trending Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Trending Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {["machine-learning", "python", "data-viz", "statistics", "deep-learning", "sql"].map((tag) => (
                    <Badge key={tag} variant="outline" className="cursor-pointer hover:bg-gray-50">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Create Post Modal */}
            {showCreatePost && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Post title..."
                    value={newPost.title}
                    onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  />
                  
                  <Select value={newPost.type} onValueChange={(value) => setNewPost(prev => ({ ...prev, type: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="insight">💡 Insight</SelectItem>
                      <SelectItem value="result">📊 Result</SelectItem>
                      <SelectItem value="question">❓ Question</SelectItem>
                      <SelectItem value="showcase">🎯 Showcase</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Textarea
                    placeholder="What would you like to share with the community?"
                    value={newPost.content}
                    onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                    rows={6}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Button 
                      onClick={() => createPostMutation.mutate(newPost)}
                      disabled={!newPost.title || !newPost.content || createPostMutation.isPending}
                    >
                      {createPostMutation.isPending ? "Publishing..." : "Publish Post"}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Posts */}
            {filteredPosts.map((post) => {
              const levelBadge = getLevelBadge(post.author.level);
              
              return (
                <Card key={post.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {post.author.name.split(" ").map(n => n[0]).join("")}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{post.author.name}</span>
                            <Badge className={levelBadge.color}>
                              {levelBadge.label}
                            </Badge>
                            <Badge className={getTypeColor(post.type)}>
                              {post.type}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{post.createdAt.toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{post.author.role.replace("_", " ")}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3">{post.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="prose prose-sm max-w-none mb-4">
                      <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                    </div>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => likePostMutation.mutate(post.id)}
                          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        
                        <div className="flex items-center space-x-1 text-gray-500">
                          <MessageSquare className="w-4 h-4" />
                          <span className="text-sm">{post.comments}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">{post.views}</span>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <Share className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}