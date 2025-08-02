import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertAssignmentSchema } from "@shared/schema";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/loading-spinner";
import { FileText, Calendar, BarChart3, X } from "lucide-react";

const assignmentFormSchema = insertAssignmentSchema.extend({
  dueDate: z.string(),
});

type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

interface AssignmentFormProps {
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  initialData?: any;
}

export default function AssignmentForm({
  onSubmit,
  onCancel,
  isLoading = false,
  initialData
}: AssignmentFormProps) {
  const { user } = useAuth();

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      classId: initialData?.classId || "",
      teacherId: user?.id || "",
      dueDate: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 16) : "",
      maxScore: initialData?.maxScore || 20,
      isPublished: initialData?.isPublished || false,
    },
  });

  // Fetch teacher's classes
  const { data: classes, isLoading: classesLoading } = useQuery({
    queryKey: ["/api/classes/teacher", user?.id],
    enabled: !!user?.id,
    retry: false,
  });

  const handleSubmit = (data: AssignmentFormData) => {
    const processedData = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString(),
    };
    onSubmit(processedData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {initialData ? "ویرایش تکلیف" : "ایجاد تکلیف جدید"}
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">اطلاعات پایه</h3>
                
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>عنوان تکلیف</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="تمرین فصل اول ریاضی"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>توضیحات تکلیف</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="توضیحات دقیق تکلیف، نحوه انجام و معیارهای ارزیابی..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="classId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>کلاس</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="کلاس را انتخاب کنید" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {classesLoading ? (
                            <div className="flex items-center justify-center p-4">
                              <LoadingSpinner size="sm" />
                            </div>
                          ) : (
                            classes?.map((cls: any) => (
                              <SelectItem key={cls.id} value={cls.id}>
                                {cls.name} - {cls.subject} (پایه {cls.grade})
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Assignment Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">تنظیمات تکلیف</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          مهلت تحویل
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="datetime-local"
                            {...field}
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
                        <FormLabel className="flex items-center gap-2">
                          <BarChart3 className="w-4 h-4" />
                          حداکثر نمره
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.5"
                            min="0"
                            placeholder="20"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <FormLabel className="text-base">انتشار تکلیف</FormLabel>
                        <p className="text-sm text-gray-500">
                          آیا تکلیف برای دانش‌آموزان قابل مشاهده باشد؟
                        </p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submission Guidelines */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">راهنمای ارسال</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">نکات مهم برای دانش‌آموزان:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• تکلیف خود را قبل از مهلت تعیین شده ارسال کنید</li>
                    <li>• از فرمت‌های مناسب برای فایل‌ها استفاده کنید</li>
                    <li>• نام و شماره دانش‌آموزی خود را در تکلیف درج کنید</li>
                    <li>• در صورت مشکل با معلم تماس بگیرید</li>
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button 
                  type="submit" 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    initialData ? "به‌روزرسانی تکلیف" : "ایجاد تکلیف"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1"
                >
                  لغو
                </Button>
              </div>

              {/* Preview Section */}
              {form.watch("title") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">پیش‌نمایش</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">
                      {form.watch("title")}
                    </h4>
                    {form.watch("description") && (
                      <p className="text-gray-700 text-sm mb-3">
                        {form.watch("description")}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {form.watch("dueDate") && (
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 ml-1" />
                          مهلت: {new Date(form.watch("dueDate")).toLocaleDateString('fa-IR')}
                        </span>
                      )}
                      <span className="flex items-center">
                        <BarChart3 className="w-3 h-3 ml-1" />
                        نمره: {form.watch("maxScore")}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
