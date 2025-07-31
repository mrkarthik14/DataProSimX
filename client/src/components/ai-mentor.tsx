import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Bot, Send, User } from "lucide-react";

interface Message {
  role: "user" | "mentor";
  content: string;
  timestamp: string;
}

export default function AiMentor() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "mentor",
      content: "Great work on the data cleaning! I notice you have some high monthly charges outliers. Have you considered using IQR method for outlier detection?",
      timestamp: new Date().toISOString(),
    },
    {
      role: "user", 
      content: "Yes, I was thinking about that. Should I remove them or investigate further?",
      timestamp: new Date().toISOString(),
    },
    {
      role: "mentor",
      content: "Great question! In telecom, high-value customers are important. I'd suggest creating a separate analysis for premium customers rather than removing them. This could be a key business insight!",
      timestamp: new Date().toISOString(),
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState("");

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest("POST", "/api/mentor/chat", { message });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        {
          role: "user",
          content: currentMessage,
          timestamp: new Date().toISOString(),
        },
        {
          role: "mentor",
          content: data.message,
          timestamp: data.timestamp,
        }
      ]);
      setCurrentMessage("");
    },
  });

  const handleSendMessage = () => {
    if (currentMessage.trim()) {
      sendMessageMutation.mutate(currentMessage);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <CardTitle>AI Mentor</CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-800">Online</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "mentor" && (
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div className={`rounded-lg p-3 max-w-xs ${
                message.role === "mentor" 
                  ? "bg-gray-100 text-gray-900" 
                  : "bg-primary text-white"
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          <Input
            placeholder="Ask your AI mentor anything..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sendMessageMutation.isPending}
          />
          <Button 
            onClick={handleSendMessage}
            disabled={sendMessageMutation.isPending || !currentMessage.trim()}
            size="sm"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
