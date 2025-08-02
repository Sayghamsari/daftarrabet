import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import AssignmentForm from "@/components/assignments/assignment-form";
import GradingSystem from "@/components/assignments/grading-system";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  BookOpen, 
  Plus, 
  Edit,
  Calendar,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from "lucide-react";

export default function Assignments() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "غیر مجاز",
        description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  // Fetch assignments based on user role
  const { data: assignments, isLoading } = useQuery({
    queryKey: user?.role === 'teacher' 
      ? ["/api/assignments/teacher", user?.id]
      : ["/api/assignments/student", user?.id],
    enabled: !!user?.id && isAuthenticated,
    retry: false,
  });

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/submissions/student", user?.id],
    enabled: user?.role === 'student' && isAuthenticated,
    retry: false,
  });

  const createAssignmentMutation = useMutation({
    mutationFn: async (assignmentData: any) => {
      await apiRequest("POST", "/api/assignments", assignmentData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      setShowCreateForm(false);
      toast({
        title: "موفق",
        description: "تکلیف با موفقیت ایجاد شد",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غیر مجاز",
          description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطا",
        description: "خطا در ایجاد تکلیف",
        variant: "destructive",
      });
    }
  });

  const submitAssignmentMutation = useMutation({
    mutationFn: async ({ assignmentId, content, fileUrl }: any) => {
      await apiRequest("POST", `/api/assignments/${assignmentId}/submit`, {
        content,
        fileUrl
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/submissions"] });
      toast({
        title: "موفق",
        description: "تکلیف با موفقیت ارسال شد",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "غیر مجاز",
          description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "خطا",
        description: "خطا در ارسال تکلیف",
        variant: "destructive",
      });
    }
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner />
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const getStatusColor = (assignment: any, userRole: string) => {
    if (userRole === 'teacher') {
      return assignment.isPublished 
        ? 'bg-green-100 text-green-800' 
        : 'bg-yellow-100 text-yellow-800';
    } else {
      // Student view - check if submitted
      const isSubmitted = submissions?.some((s: any) => s.assignmentId === assignment.id);
      return isSubmitted 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800';
    }
  };

  const getStatusLabel = (assignment: any, userRole: string) => {
    if (userRole === 'teacher') {
      return assignment.isPublished ? 'منتشر شده' : 'پیش‌نویس';
    } else {
      const isSubmitted = submissions?.some((s: any) => s.assignmentId === assignment.id);
      return isSubmitted ? 'ارسال شده' : 'ارسال نشده';
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">مدیریت تکالیف</h1>
                <p className="text-gray-600 mt-1">
                  {user?.role === 'teacher' 
                    ? 'ایجاد و مدیریت تکالیف درسی' 
                    : 'مشاهده و ارسال تکالیف'}
                </p>
              </div>
              {user?.role === 'teacher' && (
                <Button 
                  onClick={() => setShowCreateForm(true)}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  تکلیف جدید
                </Button>
              )}
            </div>

            {/* Teacher View */}
            {user?.role === 'teacher' && (
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="overview">نمای کلی</TabsTrigger>
                  <TabsTrigger value="grading">نمره‌دهی</TabsTrigger>
                  <TabsTrigger value="analytics">تحلیل‌ها</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  {/* Stats Cards */}
                  <div className="grid md:grid-cols-4 gap-6">
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">کل تکالیف</p>
                            <p className="text-2xl font-bold text-blue-600">
                              {assignments?.length || 0}
                            </p>
                          </div>
                          <BookOpen className="w-8 h-8 text-blue-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">منتشر شده</p>
                            <p className="text-2xl font-bold text-green-600">
                              {assignments?.filter((a: any) => a.isPublished).length || 0}
                            </p>
                          </div>
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">پیش‌نویس</p>
                            <p className="text-2xl font-bold text-yellow-600">
                              {assignments?.filter((a: any) => !a.isPublished).length || 0}
                            </p>
                          </div>
                          <Edit className="w-8 h-8 text-yellow-500" />
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-600">منقضی شده</p>
                            <p className="text-2xl font-bold text-red-600">
                              {assignments?.filter((a: any) => isOverdue(a.dueDate)).length || 0}
                            </p>
                          </div>
                          <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Assignments List */}
                  <Card>
                    <CardHeader>
                      <CardTitle>لیست تکالیف</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {assignments && assignments.length > 0 ? (
                        <div className="space-y-4">
                          {assignments.map((assignment: any) => (
                            <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {assignment.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400">
                                    مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    حداکثر نمره: {assignment.maxScore}
                                  </span>
                                  {isOverdue(assignment.dueDate) && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      منقضی شده
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(assignment, user.role)}>
                                  {getStatusLabel(assignment, user.role)}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <Edit className="w-4 h-4 ml-1" />
                                  ویرایش
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => setSelectedAssignment(assignment)}
                                >
                                  نمره‌دهی
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <EmptyState
                          title="تکلیفی وجود ندارد"
                          description="شما هنوز تکلیفی ایجاد نکرده‌اید"
                          icon={<BookOpen className="w-12 h-12" />}
                          actionLabel="ایجاد تکلیف جدید"
                          onAction={() => setShowCreateForm(true)}
                        />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="grading" className="space-y-6">
                  {selectedAssignment ? (
                    <GradingSystem 
                      assignment={selectedAssignment}
                      onBack={() => setSelectedAssignment(null)}
                    />
                  ) : (
                    <Card>
                      <CardContent className="p-8">
                        <EmptyState
                          title="تکلیفی انتخاب نشده"
                          description="برای شروع نمره‌دهی، تکلیفی از لیست انتخاب کنید"
                          icon={<CheckCircle className="w-12 h-12" />}
                        />
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>تحلیل عملکرد تکالیف</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">تحلیل‌های تفصیلی در نسخه‌های بعدی اضافه خواهد شد.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {/* Student View */}
            {user?.role === 'student' && (
              <div className="space-y-6">
                {/* Stats for Student */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">تکالیف جدید</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {assignments?.filter((a: any) => !submissions?.some((s: any) => s.assignmentId === a.id)).length || 0}
                          </p>
                        </div>
                        <FileText className="w-8 h-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">ارسال شده</p>
                          <p className="text-2xl font-bold text-green-600">
                            {submissions?.length || 0}
                          </p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">منقضی شده</p>
                          <p className="text-2xl font-bold text-red-600">
                            {assignments?.filter((a: any) => 
                              isOverdue(a.dueDate) && !submissions?.some((s: any) => s.assignmentId === a.id)
                            ).length || 0}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-red-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Student Assignments List */}
                <Card>
                  <CardHeader>
                    <CardTitle>تکالیف من</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {assignments && assignments.length > 0 ? (
                      <div className="space-y-4">
                        {assignments.map((assignment: any) => {
                          const submission = submissions?.find((s: any) => s.assignmentId === assignment.id);
                          const isSubmitted = !!submission;
                          const isLate = isOverdue(assignment.dueDate);
                          
                          return (
                            <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {assignment.description}
                                </p>
                                <div className="flex items-center gap-4 mt-2">
                                  <span className="text-xs text-gray-400">
                                    مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                                  </span>
                                  <span className="text-xs text-gray-400">
                                    حداکثر نمره: {assignment.maxScore}
                                  </span>
                                  {isLate && !isSubmitted && (
                                    <Badge className="bg-red-100 text-red-800 text-xs">
                                      منقضی شده
                                    </Badge>
                                  )}
                                  {submission?.isGraded && (
                                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                                      نمره: {submission.score}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={getStatusColor(assignment, user.role)}>
                                  {getStatusLabel(assignment, user.role)}
                                </Badge>
                                {!isSubmitted && !isLate && (
                                  <Button 
                                    size="sm"
                                    onClick={() => {
                                      const content = prompt("متن تکلیف را وارد کنید:");
                                      if (content) {
                                        submitAssignmentMutation.mutate({
                                          assignmentId: assignment.id,
                                          content,
                                          fileUrl: null
                                        });
                                      }
                                    }}
                                    disabled={submitAssignmentMutation.isPending}
                                  >
                                    {submitAssignmentMutation.isPending ? (
                                      <LoadingSpinner size="sm" />
                                    ) : (
                                      "ارسال"
                                    )}
                                  </Button>
                                )}
                                {isSubmitted && (
                                  <Button size="sm" variant="outline">
                                    مشاهده ارسالی
                                  </Button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <EmptyState
                        title="تکلیفی وجود ندارد"
                        description="هنوز تکلیفی برای شما تعریف نشده است"
                        icon={<BookOpen className="w-12 h-12" />}
                      />
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Create Assignment Modal */}
            {showCreateForm && (
              <AssignmentForm 
                onSubmit={(data) => createAssignmentMutation.mutate(data)}
                onCancel={() => setShowCreateForm(false)}
                isLoading={createAssignmentMutation.isPending}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
