import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ProjectTemplateCard from "@/components/project-template-card";
import { PROJECT_TEMPLATES, type ProjectTemplate } from "@/lib/project-templates";
import { Search, Filter, BookOpen, TrendingUp, Users, Clock } from "lucide-react";

interface TemplateBrowserProps {
  onTemplateStart?: (templateId: string) => void;
}

export default function TemplateBrowser({ onTemplateStart }: TemplateBrowserProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [selectedDomain, setSelectedDomain] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("recommended");

  // Get unique domains and difficulties
  const domains = useMemo(() => {
    const allDomains = PROJECT_TEMPLATES.map(t => t.domain);
    return [...new Set(allDomains)];
  }, []);

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

  // Filter and sort templates
  const filteredTemplates = useMemo(() => {
    let filtered = PROJECT_TEMPLATES.filter(template => {
      const matchesSearch = searchTerm === "" || 
        template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tools.some(tool => tool.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty;
      const matchesDomain = selectedDomain === "all" || template.domain === selectedDomain;

      return matchesSearch && matchesDifficulty && matchesDomain;
    });

    // Sort templates
    switch (sortBy) {
      case 'difficulty-asc':
        filtered.sort((a, b) => {
          const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return order[a.difficulty] - order[b.difficulty];
        });
        break;
      case 'difficulty-desc':
        filtered.sort((a, b) => {
          const order = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          return order[b.difficulty] - order[a.difficulty];
        });
        break;
      case 'xp-high':
        filtered.sort((a, b) => b.xpReward - a.xpReward);
        break;
      case 'xp-low':
        filtered.sort((a, b) => a.xpReward - b.xpReward);
        break;
      case 'recommended':
      default:
        // Keep original order (recommended)
        break;
    }

    return filtered;
  }, [searchTerm, selectedDifficulty, selectedDomain, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: PROJECT_TEMPLATES.length,
      beginner: PROJECT_TEMPLATES.filter(t => t.difficulty === 'Beginner').length,
      intermediate: PROJECT_TEMPLATES.filter(t => t.difficulty === 'Intermediate').length,
      advanced: PROJECT_TEMPLATES.filter(t => t.difficulty === 'Advanced').length,
      averageXP: Math.round(PROJECT_TEMPLATES.reduce((sum, t) => sum + t.xpReward, 0) / PROJECT_TEMPLATES.length)
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Templates</h2>
          <p className="text-gray-600">Choose from professionally-designed data science project templates</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="text-center">
            <CardContent className="py-4">
              <BookOpen className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Templates</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <TrendingUp className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{stats.averageXP}</div>
              <div className="text-sm text-gray-600">Avg XP</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <Users className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{domains.length}</div>
              <div className="text-sm text-gray-600">Domains</div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="py-4">
              <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">4-8h</div>
              <div className="text-sm text-gray-600">Est. Time</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Find Your Perfect Project
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {difficulties.map(difficulty => (
                  <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDomain} onValueChange={setSelectedDomain}>
              <SelectTrigger>
                <SelectValue placeholder="Domain" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Domains</SelectItem>
                {domains.map(domain => (
                  <SelectItem key={domain} value={domain}>{domain}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="difficulty-asc">Difficulty: Easy → Hard</SelectItem>
                <SelectItem value="difficulty-desc">Difficulty: Hard → Easy</SelectItem>
                <SelectItem value="xp-high">Highest XP</SelectItem>
                <SelectItem value="xp-low">Lowest XP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredTemplates.length} of {PROJECT_TEMPLATES.length} templates
        </div>
        <div className="flex gap-2">
          {selectedDifficulty !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedDifficulty("all")}>
              {selectedDifficulty} ×
            </Badge>
          )}
          {selectedDomain !== "all" && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedDomain("all")}>
              {selectedDomain} ×
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm("")}>
              "{searchTerm}" ×
            </Badge>
          )}
        </div>
      </div>

      {/* Template Grid */}
      {filteredTemplates.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setSelectedDifficulty("all");
              setSelectedDomain("all");
            }}>
              Clear all filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((template) => (
            <ProjectTemplateCard
              key={template.id}
              template={template}
              onStart={onTemplateStart}
            />
          ))}
        </div>
      )}
    </div>
  );
}