import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Simulation from "@/pages/simulation";
import Roles from "@/pages/roles";
import Progress from "@/pages/progress";
import CodeEditor from "@/pages/code-editor";
import Challenges from "@/pages/challenges";
import Community from "@/pages/community";
import ProjectsHub from "@/pages/projects-hub";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/simulation/:projectId?" component={Simulation} />
      <Route path="/roles" component={Roles} />
      <Route path="/progress" component={Progress} />
      <Route path="/code-editor/:projectId?" component={CodeEditor} />
      <Route path="/challenges" component={Challenges} />
      <Route path="/community" component={Community} />
      <Route path="/projects-hub" component={ProjectsHub} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
