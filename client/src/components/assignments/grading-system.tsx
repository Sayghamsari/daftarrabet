import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle, 
  Clock, 
  FileText,
  ArrowLeft,
  User,
  Calendar,
  BarChart3,
  MessageSquare,
  Star,
  AlertCircle,
  Download,
  Eye
} from "lucide-react";

interface GradingSystemProps {
  assignment: any;
  onBack: () => void;
}

export default function GradingSystem({ assignment, onBack }: GradingSystemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [gradingData, setGradingData] = useState({
    score: "",
    feedback: "",
  });

  // Fetch submissions for this assignment
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["/api/assignments", assignment.id, "submissions"],
    retry: false,
  });

  const gradeSubmissionMutation = useMutation({
    mutationFn: async ({ submissionId, score, feedback }: any) => {
      await apiRequest("PUT", `/api/submissions/${submissionId}/grade`, {
        score: parseFloat(score),
        feedback,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assignments"] });
      setSelectedSubmission(null);
      setGradingData({ score: "", feedback: "" });
      toast({
        title: "موفق",
        description: "نمره با موفقیت ثبت شد",
      });
    },
    onError: () => {
      toast({
        title: "خطا",
        description: "خطا در ثبت نمره",
        variant: "destructive",
      });
    }
  });

  const getStatusColor = (submission: any) => {
    if (submission.isGraded) {
      return 'bg-green-100 text-green-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusLabel = (submission: any) => {
    return submission.isGraded ? 'نمره داده شده' : 'در انتظار نمره';
  };

  const handleGradeSubmission = () => {
    if (!gradingData.score || !selectedSubmission) return;

    gradeSubmissionMutation.mutate({
      submissionId: selectedSubmission.id,
      score: gradingData.score,
      feedback: gradingData.feedback,
    });
  };

  const calculateStats = () => {
    if (!submissions || submissions.length === 0) {
      return {
        total: 0,
        graded: 0,
        pending: 0,
        averageScore: 0,
      };
    }

    const total = submissions.length;
    const graded = submissions.filter((s: any) => s.isGraded).length;
    const pending = total - graded;
    const gradedSubmissions = submissions.filter((s: any) => s.isGraded && s.score);
    const averageScore = gradedSubmissions.length > 0
      ? gradedSubmissions.reduce((sum: number, s: any) => sum + parseFloat(s.score), 0) / gradedSubmissions.length
      : 0;

    return {
      total,
      graded,
      pending,
      averageScore: Math.round(averageScore * 100) / 100,
    };
  };

  const stats = calculateStats();

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="flex items-center justify-center">
            <LoadingSpinner />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  نمره‌دهی: {assignment.title}
                </CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')} - 
                  حداکثر نمره: {assignment.maxScore}
                </p>
              </div>
            </div>
            <Badge className={new Date(assignment.dueDate) < new Date() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
              {new Date(assignment.dueDate) < new Date() ? 'مهلت گذشته' : 'فعال'}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">کل ارسالی‌ها</p>
                <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">نمره داده شده</p>
                <p className="text-2xl font-bold text-green-600">{stats.graded}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">در انتظار نمره</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">میانگین نمرات</p>
                <p className="text-2xl font-bold text-purple-600">{stats.averageScore}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>لیست ارسالی‌ها</CardTitle>
        </CardHeader>
        <CardContent>
          {submissions && submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission: any) => (
                <div key={submission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {submission.student?.firstName} {submission.student?.lastName}
                      </span>
                      <Badge className={getStatusColor(submission)}>
                        {getStatusLabel(submission)}
                      </Badge>
                      {submission.isGraded && (
                        <Badge variant="outline">
                          <Star className="w-3 h-3 ml-1" />
                          {submission.score}/{assignment.maxScore}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 ml-1" />
                        ارسال: {new Date(submission.submittedAt).toLocaleDateString('fa-IR')}
                      </span>
                      {submission.gradedAt && (
                        <span className="flex items-center">
                          <CheckCircle className="w-3 h-3 ml-1" />
                          نمره‌دهی: {new Date(submission.gradedAt).toLocaleDateString('fa-IR')}
                        </span>
                      )}
                    </div>

                    {submission.content && (
                      <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                        {submission.content}
                      </p>
                    )}

                    {submission.feedback && (
                      <div className="mt-2 p-2 bg-blue-50 rounded border-r-4 border-blue-400">
                        <p className="text-sm text-blue-800">
                          <MessageSquare className="w-4 h-4 inline ml-1" />
                          {submission.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {submission.fileUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 ml-1" />
                        دانلود
                      </Button>
                    )}
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setGradingData({
                              score: submission.score || "",
                              feedback: submission.feedback || "",
                            });
                          }}
                        >
                          <Eye className="w-4 h-4 ml-1" />
                          {submission.isGraded ? "مشاهده" : "نمره‌دهی"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            {submission.isGraded ? "مشاهده و ویرایش نمره" : "نمره‌دهی"}
                          </DialogTitle>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          {/* Student Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <h4 className="font-medium text-gray-900 mb-2">اطلاعات دانش‌آموز</h4>
                            <p className="text-sm text-gray-700">
                              نام: {submission.student?.firstName} {submission.student?.lastName}
                            </p>
                            <p className="text-sm text-gray-700">
                              تاریخ ارسال: {new Date(submission.submittedAt).toLocaleDateString('fa-IR')}
                            </p>
                          </div>

                          {/* Submission Content */}
                          {submission.content && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">متن ارسالی</h4>
                              <div className="bg-white border rounded-lg p-4 max-h-40 overflow-y-auto">
                                <p className="text-gray-700 whitespace-pre-wrap">
                                  {submission.content}
                                </p>
                              </div>
                            </div>
                          )}

                          {/* File */}
                          {submission.fileUrl && (
                            <div>
                              <h4 className="font-medium text-gray-900 mb-2">فایل ضمیمه</h4>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 ml-1" />
                                دانلود فایل
                              </Button>
                            </div>
                          )}

                          {/* Grading Section */}
                          <div className="space-y-4 border-t pt-4">
                            <h4 className="font-medium text-gray-900">نمره‌دهی</h4>
                            
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <Label htmlFor="score">نمره (از {assignment.maxScore})</Label>
                                <Input
                                  id="score"
                                  type="number"
                                  step="0.25"
                                  min="0"
                                  max={assignment.maxScore}
                                  value={gradingData.score}
                                  onChange={(e) => setGradingData(prev => ({
                                    ...prev,
                                    score: e.target.value
                                  }))}
                                  placeholder="نمره را وارد کنید"
                                />
                              </div>
                              
                              <div>
                                <Label>نمره به صورت درصد</Label>
                                <div className="h-10 flex items-center px-3 bg-gray-50 rounded border text-sm text-gray-600">
                                  {gradingData.score 
                                    ? Math.round((parseFloat(gradingData.score) / assignment.maxScore) * 100) + '%'
                                    : '0%'
                                  }
                                </div>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="feedback">بازخورد (اختیاری)</Label>
                              <Textarea
                                id="feedback"
                                value={gradingData.feedback}
                                onChange={(e) => setGradingData(prev => ({
                                  ...prev,
                                  feedback: e.target.value
                                }))}
                                placeholder="بازخورد و نظرات خود را اینجا بنویسید..."
                                rows={4}
                              />
                            </div>

                            {/* Quick Score Buttons */}
                            <div>
                              <Label className="text-sm text-gray-600">نمره‌دهی سریع:</Label>
                              <div className="flex gap-2 mt-2">
                                {[
                                  { label: "عالی", score: assignment.maxScore, color: "bg-green-500" },
                                  { label: "خوب", score: assignment.maxScore * 0.8, color: "bg-blue-500" },
                                  { label: "متوسط", score: assignment.maxScore * 0.6, color: "bg-yellow-500" },
                                  { label: "ضعیف", score: assignment.maxScore * 0.4, color: "bg-red-500" },
                                ].map((preset) => (
                                  <Button
                                    key={preset.label}
                                    size="sm"
                                    variant="outline"
                                    className={`${preset.color} text-white hover:opacity-80`}
                                    onClick={() => setGradingData(prev => ({
                                      ...prev,
                                      score: preset.score.toString()
                                    }))}
                                  >
                                    {preset.label} ({preset.score})
                                  </Button>
                                ))}
                              </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button 
                                onClick={handleGradeSubmission}
                                disabled={!gradingData.score || gradeSubmissionMutation.isPending}
                                className="flex-1"
                              >
                                {gradeSubmissionMutation.isPending ? (
                                  <LoadingSpinner size="sm" />
                                ) : (
                                  submission.isGraded ? "به‌روزرسانی نمره" : "ثبت نمره"
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="ارسالی وجود ندارد"
              description="هنوز دانش‌آموزی تکلیف خود را ارسال نکرده است"
              icon={<FileText className="w-12 h-12" />}
            />
          )}
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      {stats.graded > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>توزیع نمرات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "عالی (90-100%)", count: 0, color: "bg-green-500" },
                { label: "خوب (70-89%)", count: 0, color: "bg-blue-500" },
                { label: "متوسط (50-69%)", count: 0, color: "bg-yellow-500" },
                { label: "ضعیف (0-49%)", count: 0, color: "bg-red-500" },
              ].map((grade) => (
                <div key={grade.label} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 ${grade.color} rounded-full mx-auto mb-2`}></div>
                  <p className="text-sm font-medium text-gray-900">{grade.label}</p>
                  <p className="text-2xl font-bold text-gray-700">{grade.count}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
