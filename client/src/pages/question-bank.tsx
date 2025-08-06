import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Copy,
  Eye,
  Star,
  BookOpen,
  CheckCircle,
  HelpCircle,
  Target
} from "lucide-react";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function QuestionBank() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    type: "multiple_choice",
    subject: "",
    difficulty: "medium",
    options: ["", "", "", ""],
    correctAnswer: 0,
    explanation: ""
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غیر مجاز",
        description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Mock data - در آینده از API واقعی دریافت خواهد شد
  const mockQuestions = [
    {
      id: 1,
      title: "محاسبه مساحت دایره",
      content: "فرمول محاسبه مساحت دایره با شعاع r چیست؟",
      type: "multiple_choice",
      subject: "ریاضی",
      difficulty: "easy",
      options: ["πr²", "2πr", "πr", "r²"],
      correctAnswer: 0,
      explanation: "مساحت دایره برابر با π ضرب در مجذور شعاع است.",
      createdBy: "فاطمه کریمی",
      createdAt: "2024-08-01",
      isPublic: true,
      usageCount: 25
    },
    {
      id: 2,
      title: "قانون نیوتن اول",
      content: "قانون اول نیوتن در مورد چه موضوعی بیان می‌کند؟",
      type: "multiple_choice",
      subject: "فیزیک",
      difficulty: "medium",
      options: ["اینرسی", "نیرو", "حرکت", "جرم"],
      correctAnswer: 0,
      explanation: "قانون اول نیوتن در مورد اینرسی (لختی) اجسام بیان می‌کند.",
      createdBy: "محمد رضایی",
      createdAt: "2024-08-02",
      isPublic: true,
      usageCount: 18
    },
    {
      id: 3,
      title: "تعریف اتم",
      content: "کوچکترین واحد تشکیل‌دهنده ماده که خواص شیمیایی عنصر را حفظ می‌کند چیست؟",
      type: "short_answer",
      subject: "شیمی",
      difficulty: "easy",
      correctAnswer: "اتم",
      explanation: "اتم کوچکترین واحد ماده است که خواص شیمیایی عنصر را نشان می‌دهد.",
      createdBy: "علی محمدی",
      createdAt: "2024-08-03",
      isPublic: false,
      usageCount: 12
    }
  ];

  const subjects = ["ریاضی", "فیزیک", "شیمی", "زیست‌شناسی", "ادبیات", "تاریخ"];
  const difficulties = ["easy", "medium", "hard"];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getDifficultyBadge = (difficulty: string) => {
    const difficultyConfig = {
      easy: { label: "آسان", variant: "default" as const, color: "text-green-600" },
      medium: { label: "متوسط", variant: "secondary" as const, color: "text-orange-600" },
      hard: { label: "سخت", variant: "destructive" as const, color: "text-red-600" }
    };
    const config = difficultyConfig[difficulty as keyof typeof difficultyConfig];
    
    return (
      <Badge variant={config.variant} className="text-xs">
        {config.label}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    const typeIcons = {
      multiple_choice: CheckCircle,
      short_answer: HelpCircle,
      essay: BookOpen,
      true_false: Target
    };
    return typeIcons[type as keyof typeof typeIcons] || HelpCircle;
  };

  const handleCreateQuestion = () => {
    toast({
      title: "سؤال ایجاد شد",
      description: "سؤال جدید با موفقیت به بانک سؤال اضافه شد",
    });
    setIsCreateDialogOpen(false);
    setNewQuestion({
      title: "",
      content: "",
      type: "multiple_choice",
      subject: "",
      difficulty: "medium",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: ""
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         question.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === "all" || question.subject === selectedSubject;
    const matchesDifficulty = selectedDifficulty === "all" || question.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesSubject && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  بانک سؤال
                </h1>
                <p className="text-gray-600">
                  مدیریت و ایجاد سؤالات درسی
                </p>
              </div>
              {(user?.role === 'teacher' || user?.role === 'principal') && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      ایجاد سؤال جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>ایجاد سؤال جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان سؤال</Label>
                        <Input
                          id="title"
                          value={newQuestion.title}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="عنوان سؤال را وارد کنید"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="content">متن سؤال</Label>
                        <Textarea
                          id="content"
                          value={newQuestion.content}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, content: e.target.value }))}
                          placeholder="متن کامل سؤال را وارد کنید"
                          rows={3}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="type">نوع سؤال</Label>
                          <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">چند گزینه‌ای</SelectItem>
                              <SelectItem value="short_answer">پاسخ کوتاه</SelectItem>
                              <SelectItem value="essay">تشریحی</SelectItem>
                              <SelectItem value="true_false">درست/غلط</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="subject">درس</Label>
                          <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, subject: value }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="انتخاب درس" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map(subject => (
                                <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="difficulty">سطح دشواری</Label>
                          <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion(prev => ({ ...prev, difficulty: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">آسان</SelectItem>
                              <SelectItem value="medium">متوسط</SelectItem>
                              <SelectItem value="hard">سخت</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {newQuestion.type === "multiple_choice" && (
                        <div>
                          <Label>گزینه‌ها</Label>
                          <div className="space-y-2">
                            {newQuestion.options.map((option, index) => (
                              <div key={index} className="flex items-center gap-2">
                                <Input
                                  value={option}
                                  onChange={(e) => handleOptionChange(index, e.target.value)}
                                  placeholder={`گزینه ${index + 1}`}
                                />
                                <Button
                                  type="button"
                                  variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setNewQuestion(prev => ({ ...prev, correctAnswer: index }))}
                                >
                                  {newQuestion.correctAnswer === index ? "صحیح" : "انتخاب"}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div>
                        <Label htmlFor="explanation">توضیح پاسخ</Label>
                        <Textarea
                          id="explanation"
                          value={newQuestion.explanation}
                          onChange={(e) => setNewQuestion(prev => ({ ...prev, explanation: e.target.value }))}
                          placeholder="توضیح پاسخ صحیح را وارد کنید"
                          rows={2}
                        />
                      </div>

                      <Button onClick={handleCreateQuestion} className="w-full">
                        ایجاد سؤال
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کل سؤالات</p>
                      <p className="text-2xl font-bold text-blue-600">{mockQuestions.length}</p>
                    </div>
                    <HelpCircle className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">سؤالات عمومی</p>
                      <p className="text-2xl font-bold text-green-600">
                        {mockQuestions.filter(q => q.isPublic).length}
                      </p>
                    </div>
                    <Eye className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">درس‌ها</p>
                      <p className="text-2xl font-bold text-purple-600">{subjects.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">استفاده امروز</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {mockQuestions.reduce((sum, q) => sum + q.usageCount, 0)}
                      </p>
                    </div>
                    <Star className="w-8 h-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="جستجو در سؤالات..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="همه درس‌ها" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه درس‌ها</SelectItem>
                        {subjects.map(subject => (
                          <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="همه سطوح" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">همه سطوح</SelectItem>
                        <SelectItem value="easy">آسان</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="hard">سخت</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <div className="space-y-4">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((question) => {
                  const TypeIcon = getTypeIcon(question.type);
                  return (
                    <Card key={question.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <TypeIcon className="w-5 h-5 text-blue-600" />
                              <h3 className="text-lg font-semibold">{question.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {question.subject}
                              </Badge>
                              {getDifficultyBadge(question.difficulty)}
                              {question.isPublic && (
                                <Badge variant="secondary" className="text-xs">
                                  عمومی
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-gray-600 mb-3">{question.content}</p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>ایجاد شده توسط: {question.createdBy}</span>
                              <span>تاریخ: {new Date(question.createdAt).toLocaleDateString('fa-IR')}</span>
                              <span>استفاده: {question.usageCount} بار</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-2">
                              <Eye className="w-4 h-4" />
                              مشاهده
                            </Button>
                            {(user?.role === 'teacher' || user?.role === 'principal') && (
                              <>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Copy className="w-4 h-4" />
                                  کپی
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2">
                                  <Edit className="w-4 h-4" />
                                  ویرایش
                                </Button>
                                <Button variant="outline" size="sm" className="gap-2 text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                  حذف
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <HelpCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-500 mb-2">
                      هیچ سؤالی یافت نشد
                    </h3>
                    <p className="text-gray-400">
                      سؤال جدیدی ایجاد کنید یا فیلترهای جستجو را تغییر دهید
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}