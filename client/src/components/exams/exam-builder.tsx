import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText, Clock, Users, BookOpen, Copy, Eye, Shuffle } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const questionSchema = z.object({
  type: z.enum(["multiple_choice", "true_false", "short_answer", "essay"]),
  question: z.string().min(10, "سوال باید حداقل 10 کاراکتر باشد"),
  options: z.array(z.string()).optional(),
  correctAnswer: z.string().min(1, "پاسخ صحیح الزامی است"),
  points: z.number().min(0.5, "امتیاز نباید کمتر از 0.5 باشد").max(10, "امتیاز نباید بیشتر از 10 باشد"),
  explanation: z.string().optional()
});

const examSchema = z.object({
  title: z.string().min(3, "عنوان آزمون باید حداقل 3 کاراکتر باشد"),
  description: z.string().min(10, "توضیحات باید حداقل 10 کاراکتر باشد"),
  subject: z.string().min(1, "انتخاب درس الزامی است"),
  duration: z.number().min(10, "مدت آزمون باید حداقل 10 دقیقه باشد").max(300, "مدت آزمون نباید بیشتر از 300 دقیقه باشد"),
  totalPoints: z.number().min(1, "مجموع امتیازات باید حداقل 1 باشد"),
  passingScore: z.number().min(0, "نمره قبولی باید مثبت باشد"),
  instructions: z.string().optional(),
  isRandomizeQuestions: z.boolean().default(false),
  isRandomizeOptions: z.boolean().default(false),
  allowBackward: z.boolean().default(true),
  showResults: z.boolean().default(true),
  questions: z.array(questionSchema).min(1, "حداقل یک سوال الزامی است")
});

type ExamFormData = z.infer<typeof examSchema>;
type QuestionFormData = z.infer<typeof questionSchema>;

const questionTypes = [
  { value: "multiple_choice", label: "چهار گزینه‌ای", icon: "🔘" },
  { value: "true_false", label: "صحیح/غلط", icon: "✅" },
  { value: "short_answer", label: "پاسخ کوتاه", icon: "📝" },
  { value: "essay", label: "تشریحی", icon: "📄" }
];

export function ExamBuilder() {
  const [previewMode, setPreviewMode] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExamFormData>({
    resolver: zodResolver(examSchema),
    defaultValues: {
      title: "",
      description: "",
      subject: "",
      duration: 60,
      totalPoints: 0,
      passingScore: 60,
      instructions: "این آزمون شامل سوالات متنوعی است. لطفاً با دقت پاسخ دهید.",
      isRandomizeQuestions: false,
      isRandomizeOptions: false,
      allowBackward: true,
      showResults: true,
      questions: [{
        type: "multiple_choice",
        question: "",
        options: ["", "", "", ""],
        correctAnswer: "",
        points: 1,
        explanation: ""
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "questions"
  });

  // Calculate total points automatically
  const watchedQuestions = form.watch("questions");
  const totalPoints = watchedQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
  
  // Update total points when questions change
  if (form.getValues().totalPoints !== totalPoints) {
    form.setValue("totalPoints", totalPoints);
  }

  const createExamMutation = useMutation({
    mutationFn: async (data: ExamFormData) => {
      const response = await apiRequest("POST", "/api/examinations/create", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "آزمون با موفقیت ساخته شد",
        variant: "default"
      });
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در ساخت آزمون",
        variant: "destructive"
      });
    }
  });

  const addQuestion = (type: QuestionFormData["type"] = "multiple_choice") => {
    const newQuestion: QuestionFormData = {
      type,
      question: "",
      options: type === "multiple_choice" ? ["", "", "", ""] : type === "true_false" ? ["صحیح", "غلط"] : undefined,
      correctAnswer: "",
      points: 1,
      explanation: ""
    };
    append(newQuestion);
  };

  const duplicateQuestion = (index: number) => {
    const questionToCopy = form.getValues(`questions.${index}`);
    append({
      ...questionToCopy,
      question: questionToCopy.question + " (کپی)"
    });
  };

  const getQuestionTypeIcon = (type: string) => {
    return questionTypes.find(t => t.value === type)?.icon || "❓";
  };

  const getQuestionTypeLabel = (type: string) => {
    return questionTypes.find(t => t.value === type)?.label || type;
  };

  const onSubmit = (data: ExamFormData) => {
    createExamMutation.mutate(data);
  };

  if (previewMode) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-shabnam font-bold">پیش‌نمای آزمون</h2>
          <Button onClick={() => setPreviewMode(false)} variant="outline">
            بازگشت به ویرایش
          </Button>
        </div>
        <ExamPreview examData={form.getValues()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-shabnam font-bold">سازنده آزمون هوشمند</h2>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(true)}
            className="font-vazir"
          >
            <Eye className="w-4 h-4 ml-2" />
            پیش‌نمای
          </Button>
          <Button
            form="exam-form"
            type="submit"
            disabled={createExamMutation.isPending}
            className="font-vazir"
          >
            <FileText className="w-4 h-4 ml-2" />
            {createExamMutation.isPending ? "در حال ساخت..." : "ایجاد آزمون"}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form id="exam-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Exam Info */}
          <Card>
            <CardHeader>
              <CardTitle className="font-shabnam">اطلاعات آزمون</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">عنوان آزمون</FormLabel>
                      <FormControl>
                        <Input placeholder="آزمون میان‌ترم ریاضی" {...field} className="font-vazir" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
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
                          <SelectItem value="math">ریاضی</SelectItem>
                          <SelectItem value="physics">فیزیک</SelectItem>
                          <SelectItem value="chemistry">شیمی</SelectItem>
                          <SelectItem value="biology">زیست‌شناسی</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-vazir">توضیحات آزمون</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="توضیح مختصری از محتوای آزمون..."
                        {...field}
                        className="font-vazir"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">مدت (دقیقه)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="totalPoints"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">مجموع امتیاز</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          disabled
                          value={totalPoints}
                          className="bg-muted"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="passingScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">نمره قبولی (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center space-x-2 space-x-reverse">
                  <Badge variant="outline" className="font-vazir">
                    {fields.length} سوال
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-shabnam">سوالات آزمون</CardTitle>
                <div className="flex gap-2">
                  {questionTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addQuestion(type.value as QuestionFormData["type"])}
                      className="font-vazir"
                    >
                      <Plus className="w-3 h-3 ml-1" />
                      {type.icon} {type.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="font-vazir">
                        سوال {index + 1}
                      </Badge>
                      <Badge variant="outline" className="font-vazir">
                        {getQuestionTypeIcon(form.watch(`questions.${index}.type`))}
                        {getQuestionTypeLabel(form.watch(`questions.${index}.type`))}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => duplicateQuestion(index)}
                        className="font-vazir"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <FormField
                          control={form.control}
                          name={`questions.${index}.question`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="font-vazir">متن سوال</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="سوال خود را اینجا بنویسید..."
                                  {...field}
                                  className="font-vazir"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name={`questions.${index}.points`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="font-vazir">امتیاز</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="10"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <QuestionOptionsRenderer 
                      questionIndex={index} 
                      questionType={form.watch(`questions.${index}.type`)}
                      form={form}
                    />
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}

function QuestionOptionsRenderer({ 
  questionIndex, 
  questionType, 
  form 
}: { 
  questionIndex: number;
  questionType: string;
  form: any;
}) {
  if (questionType === "multiple_choice") {
    return (
      <div className="space-y-3">
        <FormLabel className="font-vazir">گزینه‌ها</FormLabel>
        {form.watch(`questions.${questionIndex}.options`).map((_: any, optionIndex: number) => (
          <div key={optionIndex} className="flex gap-3">
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.options.${optionIndex}`}
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input 
                      placeholder={`گزینه ${optionIndex + 1}`}
                      {...field}
                      className="font-vazir"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`questions.${questionIndex}.correctAnswer`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value === form.watch(`questions.${questionIndex}.options.${optionIndex}`)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          field.onChange(form.watch(`questions.${questionIndex}.options.${optionIndex}`));
                        }
                      }}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        ))}
      </div>
    );
  }

  if (questionType === "true_false") {
    return (
      <FormField
        control={form.control}
        name={`questions.${questionIndex}.correctAnswer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-vazir">پاسخ صحیح</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="انتخاب پاسخ صحیح" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="صحیح">صحیح</SelectItem>
                <SelectItem value="غلط">غلط</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <FormField
      control={form.control}
      name={`questions.${questionIndex}.correctAnswer`}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-vazir">پاسخ نمونه</FormLabel>
          <FormControl>
            <Textarea
              placeholder="پاسخ نمونه یا کلیدواژه‌های مهم..."
              {...field}
              className="font-vazir"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function ExamPreview({ examData }: { examData: ExamFormData }) {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-shabnam text-2xl">{examData.title}</CardTitle>
        <div className="flex justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span className="font-vazir">{examData.duration} دقیقه</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            <span className="font-vazir">{examData.questions.length} سوال</span>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="outline">{examData.totalPoints} امتیاز</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-lg">
          <p className="font-vazir">{examData.description}</p>
          {examData.instructions && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm font-vazir">{examData.instructions}</p>
            </div>
          )}
        </div>

        {examData.questions.map((question, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-3">
              <Badge variant="secondary">{index + 1}</Badge>
              <div className="flex-1">
                <p className="font-vazir mb-3">{question.question}</p>
                {question.type === "multiple_choice" && (
                  <div className="space-y-2">
                    {question.options?.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center gap-2">
                        <div className="w-4 h-4 border rounded-full"></div>
                        <span className="font-vazir">{option}</span>
                      </div>
                    ))}
                  </div>
                )}
                {question.type === "true_false" && (
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded-full"></div>
                      <span className="font-vazir">صحیح</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border rounded-full"></div>
                      <span className="font-vazir">غلط</span>
                    </div>
                  </div>
                )}
                {(question.type === "short_answer" || question.type === "essay") && (
                  <div className="border rounded-lg p-3 bg-gray-50 min-h-20">
                    <p className="text-sm text-muted-foreground font-vazir">محل پاسخ...</p>
                  </div>
                )}
              </div>
              <Badge variant="outline" className="font-vazir">
                {question.points} امتیاز
              </Badge>
            </div>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
}