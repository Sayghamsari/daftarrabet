import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BookOpen, Plus, Edit, Save, Download, Upload, BarChart3 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const gradeSchema = z.object({
  studentId: z.string().min(1, "انتخاب دانش‌آموز الزامی است"),
  subjectId: z.string().min(1, "انتخاب درس الزامی است"),
  examType: z.enum(["quiz", "midterm", "final", "homework", "project"], {
    required_error: "نوع آزمون را انتخاب کنید"
  }),
  score: z.number().min(0, "نمره نمی‌تواند منفی باشد").max(20, "نمره نمی‌تواند بیش از 20 باشد"),
  maxScore: z.number().default(20),
  examDate: z.string().min(1, "تاریخ آزمون الزامی است"),
  description: z.string().optional()
});

type GradeFormData = z.infer<typeof gradeSchema>;

interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  subjectName: string;
  examType: string;
  score: number;
  maxScore: number;
  percentage: number;
  examDate: string;
  description?: string;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  nationalId: string;
}

interface Subject {
  id: string;
  name: string;
  code: string;
}

export function GradeManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data
  const mockStudents: Student[] = [
    { id: "1", name: "علی احمدی", nationalId: "1234567890" },
    { id: "2", name: "فاطمه کریمی", nationalId: "2345678901" },
    { id: "3", name: "محمد رضایی", nationalId: "3456789012" }
  ];

  const mockSubjects: Subject[] = [
    { id: "math", name: "ریاضی", code: "MATH" },
    { id: "physics", name: "فیزیک", code: "PHYS" },
    { id: "chemistry", name: "شیمی", code: "CHEM" },
    { id: "biology", name: "زیست‌شناسی", code: "BIO" }
  ];

  const [grades, setGrades] = useState<Grade[]>([
    {
      id: "1",
      studentId: "1",
      studentName: "علی احمدی",
      subjectName: "ریاضی",
      examType: "midterm",
      score: 17.5,
      maxScore: 20,
      percentage: 87.5,
      examDate: "2024-08-10",
      description: "آزمون میان‌ترم فصل 3",
      createdAt: "2024-08-11T10:00:00Z"
    },
    {
      id: "2", 
      studentId: "2",
      studentName: "فاطمه کریمی",
      subjectName: "فیزیک",
      examType: "quiz",
      score: 19,
      maxScore: 20,
      percentage: 95,
      examDate: "2024-08-09",
      description: "کوئیز فصل 2",
      createdAt: "2024-08-10T14:30:00Z"
    }
  ]);

  const form = useForm<GradeFormData>({
    resolver: zodResolver(gradeSchema),
    defaultValues: {
      studentId: "",
      subjectId: "",
      examType: "quiz",
      score: 0,
      maxScore: 20,
      examDate: "",
      description: ""
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (data: GradeFormData) => {
      // Calculate percentage
      const percentage = (data.score / data.maxScore) * 100;
      
      const student = mockStudents.find(s => s.id === data.studentId);
      const subject = mockSubjects.find(s => s.id === data.subjectId);
      
      const gradeData = {
        ...data,
        studentName: student?.name || "",
        subjectName: subject?.name || "",
        percentage
      };

      if (editingGrade) {
        const response = await apiRequest("PUT", `/api/grades/${editingGrade.id}`, gradeData);
        return response.json();
      } else {
        const response = await apiRequest("POST", "/api/grades", gradeData);
        return response.json();
      }
    },
    onSuccess: (savedGrade) => {
      const student = mockStudents.find(s => s.id === form.getValues().studentId);
      const subject = mockSubjects.find(s => s.id === form.getValues().subjectId);
      
      const newGrade: Grade = {
        id: savedGrade.id || Date.now().toString(),
        studentId: form.getValues().studentId,
        studentName: student?.name || "",
        subjectName: subject?.name || "",
        examType: form.getValues().examType,
        score: form.getValues().score,
        maxScore: form.getValues().maxScore,
        percentage: (form.getValues().score / form.getValues().maxScore) * 100,
        examDate: form.getValues().examDate,
        description: form.getValues().description,
        createdAt: new Date().toISOString()
      };

      if (editingGrade) {
        setGrades(prev => prev.map(g => g.id === editingGrade.id ? newGrade : g));
        toast({
          title: "موفقیت",
          description: "نمره با موفقیت ویرایش شد",
          variant: "default"
        });
      } else {
        setGrades(prev => [newGrade, ...prev]);
        toast({
          title: "موفقیت", 
          description: "نمره با موفقیت ثبت شد",
          variant: "default"
        });
      }

      form.reset();
      setIsDialogOpen(false);
      setEditingGrade(null);
    },
    onError: (error: Error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در ثبت نمره",
        variant: "destructive"
      });
    }
  });

  const getExamTypeLabel = (type: string) => {
    const typeMap = {
      quiz: "کوئیز",
      midterm: "میان‌ترم",
      final: "پایان‌ترم",
      homework: "تکلیف",
      project: "پروژه"
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge variant="default" className="bg-green-500">عالی</Badge>;
    if (percentage >= 80) return <Badge variant="default" className="bg-blue-500">خوب</Badge>;
    if (percentage >= 70) return <Badge variant="secondary">متوسط</Badge>;
    if (percentage >= 60) return <Badge variant="outline">قابل قبول</Badge>;
    return <Badge variant="destructive">نیاز به تلاش</Badge>;
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    form.reset({
      studentId: grade.studentId,
      subjectId: mockSubjects.find(s => s.name === grade.subjectName)?.id || "",
      examType: grade.examType as any,
      score: grade.score,
      maxScore: grade.maxScore,
      examDate: grade.examDate,
      description: grade.description || ""
    });
    setIsDialogOpen(true);
  };

  const handleBulkImport = () => {
    toast({
      title: "قابلیت جدید",
      description: "امکان وارد کردن گروهی نمرات از فایل Excel به زودی اضافه می‌شود",
      variant: "default"
    });
  };

  const filteredGrades = grades.filter(grade => {
    return (!selectedSubject || grade.subjectName.includes(selectedSubject));
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-shabnam font-bold">مدیریت نمرات</h2>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleBulkImport} className="font-vazir">
            <Upload className="w-4 h-4 ml-2" />
            وارد کردن گروهی
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="font-vazir">
                <Plus className="w-4 h-4 ml-2" />
                ثبت نمره جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="font-shabnam">
                  {editingGrade ? "ویرایش نمره" : "ثبت نمره جدید"}
                </DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => saveMutation.mutate(data))} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-vazir">دانش‌آموز</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="انتخاب دانش‌آموز" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockStudents.map(student => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.name}
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
                    name="subjectId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-vazir">درس</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="انتخاب درس" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockSubjects.map(subject => (
                              <SelectItem key={subject.id} value={subject.id}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="examType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazir">نوع آزمون</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="quiz">کوئیز</SelectItem>
                              <SelectItem value="midterm">میان‌ترم</SelectItem>
                              <SelectItem value="final">پایان‌ترم</SelectItem>
                              <SelectItem value="homework">تکلیف</SelectItem>
                              <SelectItem value="project">پروژه</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="examDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazir">تاریخ آزمون</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="score"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazir">نمره کسب شده</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.25"
                              min="0"
                              max="20"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="maxScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-vazir">نمره کامل</FormLabel>
                          <FormControl>
                            <Input 
                              type="number"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 20)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="submit" disabled={saveMutation.isPending} className="font-vazir">
                      <Save className="w-4 h-4 ml-2" />
                      {saveMutation.isPending ? "در حال ذخیره..." : "ذخیره"}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      انصراف
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="font-shabnam text-lg">فیلتر نمرات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="همه دروس" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">همه دروس</SelectItem>
                {mockSubjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.name}>
                    {subject.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Grades table */}
      <Card>
        <CardHeader>
          <CardTitle className="font-shabnam text-lg">لیست نمرات</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-vazir">دانش‌آموز</TableHead>
                <TableHead className="font-vazir">درس</TableHead>
                <TableHead className="font-vazir">نوع آزمون</TableHead>
                <TableHead className="font-vazir">نمره</TableHead>
                <TableHead className="font-vazir">درصد</TableHead>
                <TableHead className="font-vazir">وضعیت</TableHead>
                <TableHead className="font-vazir">تاریخ</TableHead>
                <TableHead className="font-vazir">عملیات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGrades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-vazir">{grade.studentName}</TableCell>
                  <TableCell className="font-vazir">{grade.subjectName}</TableCell>
                  <TableCell className="font-vazir">{getExamTypeLabel(grade.examType)}</TableCell>
                  <TableCell className="font-vazir">{grade.score}/{grade.maxScore}</TableCell>
                  <TableCell className="font-vazir">{grade.percentage.toFixed(1)}%</TableCell>
                  <TableCell>{getGradeBadge(grade.percentage)}</TableCell>
                  <TableCell className="font-vazir">
                    {new Date(grade.examDate).toLocaleDateString('fa-IR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(grade)}
                      className="font-vazir"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}