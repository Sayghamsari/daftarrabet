import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertQuestionBankSchema } from "@shared/schema";
import { z } from "zod";
import { 
  HelpCircle, 
  Plus, 
  Search,
  Filter,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  Target,
  CheckCircle,
  X,
  Tag
} from "lucide-react";

const questionFormSchema = insertQuestionBankSchema.extend({
  options: z.array(z.string()).optional(),
});

type QuestionFormData = z.infer<typeof questionFormSchema>;

export default function QuestionBank() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [editingQuestion, setEditingQuestion] = useState<any>(null);

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      question: "",
      questionType: "multiple_choice",
      options: ["", "", "", ""],
      correctAnswer: "",
      subject: "",
      grade: "",
      difficulty: "medium",
      tags: [],
    },
  });

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

  // Search questions
  const { data: questions, isLoading } = useQuery({
    queryKey: ["/api/questions/search", searchTerm, selectedSubject, selectedGrade, selectedDifficulty],
    queryFn: () => {
      if (!searchTerm) return [];
      const params = new URLSearchParams({
        q: searchTerm,
        ...(selectedSubject && { subject: selectedSubject }),
        ...(selectedGrade && { grade: selectedGrade }),
        ...(selectedDifficulty && { difficulty: selectedDifficulty }),
      });
      return fetch(`/api/questions/search?${params}`).then(res => res.json());
    },
    enabled: !!searchTerm && isAuthenticated,
    retry: false,
  });

  // Get questions by subject
  const { data: subjectQuestions } = useQuery({
    queryKey: ["/api/questions/subject", selectedSubject, selectedGrade],
    enabled: !!selectedSubject && !searchTerm && isAuthenticated,
    retry: false,
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (questionData: QuestionFormData) => {
      await apiRequest("POST", "/api/questions", questionData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      setShowCreateForm(false);
      form.reset();
      toast({
        title: "موفق",
        description: "سؤال با موفقیت ایجاد شد",
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
        description: "خطا در ایجاد سؤال",
        variant: "destructive",
      });
    }
  });

  if (authLoading) {
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

  const displayedQuestions = searchTerm && questions ? questions : subjectQuestions || [];

  const subjects = ["ریاضی", "فیزیک", "شیمی", "زیست‌شناسی", "زبان انگلیسی", "ادبیات فارسی", "تاریخ", "جغرافیا"];
  const grades = ["هفتم", "هشتم", "نهم", "دهم", "یازدهم", "دوازدهم"];
  const difficulties = [
    { value: "easy", label: "آسان" },
    { value: "medium", label: "متوسط" },
    { value: "hard", label: "سخت" }
  ];

  const questionTypes = [
    { value: "multiple_choice", label: "چند گزینه‌ای" },
    { value: "essay", label: "تشریحی" },
    { value: "fill_blank", label: "جای خالی" },
    { value: "true_false", label: "درست/غلط" }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    return difficulties.find(d => d.value === difficulty)?.label || difficulty;
  };

  const getQuestionTypeLabel = (type: string) => {
    return questionTypes.find(t => t.value === type)?.label || type;
  };

  const onSubmit = (data: QuestionFormData) => {
    const processedData = {
      ...data,
      options: data.questionType === 'multiple_choice' ? data.options?.filter(Boolean) : null,
    };
    createQuestionMutation.mutate(processedData);
  };

  const handleEdit = (question: any) => {
    setEditingQuestion(question);
    form.reset({
      question: question.question,
      questionType: question.questionType,
      options: question.options || ["", "", "", ""],
      correctAnswer: question.correctAnswer,
      subject: question.subject,
      grade: question.grade,
      difficulty: question.difficulty,
      tags: question.tags || [],
    });
    setShowCreateForm(true);
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
                <h1 className="text-3xl font-bold text-gray-900">بانک سؤال</h1>
                <p className="text-gray-600 mt-1">مدیریت و دسته‌بندی سؤالات آزمون</p>
              </div>
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="w-4 h-4" />
                    سؤال جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingQuestion ? "ویرایش سؤال" : "ایجاد سؤال جدید"}
                    </DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="question"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>متن سؤال</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="متن سؤال را وارد کنید..." 
                                {...field} 
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="questionType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>نوع سؤال</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="نوع سؤال را انتخاب کنید" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {questionTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="difficulty"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>درجه سختی</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="درجه سختی را انتخاب کنید" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {difficulties.map((difficulty) => (
                                    <SelectItem key={difficulty.value} value={difficulty.value}>
                                      {difficulty.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>درس</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="درس را انتخاب کنید" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="grade"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>پایه تحصیلی</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="پایه را انتخاب کنید" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {grades.map((grade) => (
                                    <SelectItem key={grade} value={grade}>
                                      {grade}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {form.watch("questionType") === "multiple_choice" && (
                        <div className="space-y-3">
                          <Label>گزینه‌ها</Label>
                          {[0, 1, 2, 3].map((index) => (
                            <FormField
                              key={index}
                              control={form.control}
                              name={`options.${index}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input 
                                      placeholder={`گزینه ${index + 1}`} 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          ))}
                        </div>
                      )}

                      <FormField
                        control={form.control}
                        name="correctAnswer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>پاسخ صحیح</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="پاسخ صحیح را وارد کنید..." 
                                {...field} 
                                rows={2}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-2 pt-4">
                        <Button 
                          type="submit" 
                          disabled={createQuestionMutation.isPending}
                          className="flex-1"
                        >
                          {createQuestionMutation.isPending ? (
                            <LoadingSpinner size="sm" />
                          ) : (
                            editingQuestion ? "به‌روزرسانی سؤال" : "ایجاد سؤال"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setShowCreateForm(false);
                            setEditingQuestion(null);
                            form.reset();
                          }}
                          className="flex-1"
                        >
                          لغو
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  جستجو و فیلتر
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      placeholder="جستجو در متن سؤالات..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button variant="outline" disabled={isLoading}>
                    {isLoading ? <LoadingSpinner size="sm" /> : <Search className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه دروس" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">همه دروس</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedGrade} onValueChange={setSelectedGrade}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه پایه‌ها" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">همه پایه‌ها</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={grade}>
                          {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="همه سطوح" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">همه سطوح</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty.value} value={difficulty.value}>
                          {difficulty.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSelectedSubject("");
                      setSelectedGrade("");
                      setSelectedDifficulty("");
                      setSearchTerm("");
                    }}
                  >
                    <X className="w-4 h-4 ml-2" />
                    پاک کردن
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5" />
                    لیست سؤالات
                  </span>
                  {displayedQuestions.length > 0 && (
                    <Badge variant="outline">
                      {displayedQuestions.length} سؤال
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayedQuestions.length > 0 ? (
                  <div className="space-y-4">
                    {displayedQuestions.map((question: any) => (
                      <div key={question.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getDifficultyColor(question.difficulty)}>
                                <Target className="w-3 h-3 ml-1" />
                                {getDifficultyLabel(question.difficulty)}
                              </Badge>
                              <Badge variant="outline">
                                {getQuestionTypeLabel(question.questionType)}
                              </Badge>
                              <Badge variant="secondary">
                                <BookOpen className="w-3 h-3 ml-1" />
                                {question.subject}
                              </Badge>
                              <Badge variant="secondary">
                                <GraduationCap className="w-3 h-3 ml-1" />
                                {question.grade}
                              </Badge>
                            </div>
                            
                            <p className="text-gray-900 font-medium mb-2">{question.question}</p>
                            
                            {question.questionType === 'multiple_choice' && question.options && (
                              <div className="space-y-1 mb-2">
                                {question.options.map((option: string, index: number) => (
                                  <div key={index} className="flex items-center text-sm text-gray-600">
                                    <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-medium ml-2">
                                      {String.fromCharCode(65 + index)}
                                    </span>
                                    {option}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            <div className="flex items-center text-sm text-gray-500">
                              <CheckCircle className="w-4 h-4 ml-1 text-green-500" />
                              پاسخ صحیح: {question.correctAnswer}
                            </div>

                            {question.tags && question.tags.length > 0 && (
                              <div className="flex items-center gap-1 mt-2">
                                <Tag className="w-4 h-4 text-gray-400" />
                                {question.tags.map((tag: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEdit(question)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : searchTerm || selectedSubject ? (
                  <EmptyState
                    title="سؤالی یافت نشد"
                    description="با فیلترهای انتخابی سؤالی پیدا نشد. فیلترها را تغییر دهید"
                    icon={<Search className="w-12 h-12" />}
                  />
                ) : (
                  <EmptyState
                    title="سؤالی وجود ندارد"
                    description="هنوز سؤالی در بانک سؤال ایجاد نشده است"
                    icon={<HelpCircle className="w-12 h-12" />}
                    actionLabel="ایجاد اولین سؤال"
                    onAction={() => setShowCreateForm(true)}
                  />
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
