import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/contexts/theme-context";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Home from "@/pages/home";
import AuthPage from "@/pages/auth";
import StudentDashboard from "@/pages/dashboard/student";
import TeacherDashboard from "@/pages/dashboard/teacher";
import CounselorDashboard from "@/pages/dashboard/counselor";
import EducationalDeputyDashboard from "@/pages/dashboard/educational-deputy";
import LiaisonOfficeDashboard from "@/pages/dashboard/liaison-office";
import ParentDashboard from "@/pages/dashboard/parent";
import Assignments from "@/pages/assignments";
import Attendance from "@/pages/attendance";
import OnlineClassroom from "@/pages/online-classroom";
import QuestionBank from "@/pages/question-bank";
import Examinations from "@/pages/examinations";
import SMSDashboard from "@/pages/sms-dashboard";
import GradeDashboard from "@/pages/grade-dashboard";
import ExamBuilderDashboard from "@/pages/exam-builder-dashboard";
import LoadingSpinner from "@/components/common/loading-spinner";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard/student/:id?" component={StudentDashboard} />
          <Route path="/dashboard/teacher/:id?" component={TeacherDashboard} />
          <Route path="/dashboard/counselor/:id?" component={CounselorDashboard} />
          <Route path="/dashboard/educational-deputy/:id?" component={EducationalDeputyDashboard} />
          <Route path="/dashboard/liaison-office/:id?" component={LiaisonOfficeDashboard} />
          <Route path="/dashboard/parent/:id?" component={ParentDashboard} />
          <Route path="/assignments" component={Assignments} />
          <Route path="/attendance" component={Attendance} />
          <Route path="/online-classroom" component={OnlineClassroom} />
          <Route path="/question-bank" component={QuestionBank} />
          <Route path="/examinations" component={Examinations} />
          <Route path="/sms-dashboard" component={SMSDashboard} />
          <Route path="/grade-dashboard" component={GradeDashboard} />
          <Route path="/exam-builder-dashboard" component={ExamBuilderDashboard} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <div className="font-vazir min-h-screen bg-background text-foreground transition-all duration-300" dir="rtl">
              <Toaster />
              <Router />
            </div>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
