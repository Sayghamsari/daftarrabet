import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, Send, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const submissionSchema = z.object({
  content: z.string().min(10, "محتوای تکلیف باید حداقل 10 کاراکتر باشد"),
  notes: z.string().optional(),
  attachmentUrl: z.string().optional()
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

interface AssignmentSubmissionProps {
  assignmentId: string;
  assignmentTitle: string;
  dueDate: string;
  onSubmissionSuccess?: () => void;
}

export function AssignmentSubmission({ 
  assignmentId, 
  assignmentTitle, 
  dueDate,
  onSubmissionSuccess 
}: AssignmentSubmissionProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      content: "",
      notes: "",
      attachmentUrl: ""
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: SubmissionFormData) => {
      const response = await apiRequest("POST", `/api/assignments/${assignmentId}/submit`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "تکلیف با موفقیت ارسال شد",
        variant: "default"
      });
      form.reset();
      setUploadedFile(null);
      onSubmissionSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
    },
    onError: (error: Error) => {
      toast({
        title: "خطا در ارسال",
        description: error.message || "خطا در ارسال تکلیف",
        variant: "destructive"
      });
    }
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "خطا",
        description: "حجم فایل نباید بیشتر از 5 مگابایت باشد",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      // Mock file upload - در پروژه واقعی به سرور آپلود می‌شود
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockUrl = `/files/${Date.now()}-${file.name}`;
      setUploadedFile(file);
      form.setValue("attachmentUrl", mockUrl);
      
      toast({
        title: "موفقیت",
        description: "فایل با موفقیت آپلود شد",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در آپلود فایل",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = (data: SubmissionFormData) => {
    submitMutation.mutate(data);
  };

  const isOverdue = new Date() > new Date(dueDate);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-shabnam text-lg flex items-center gap-2">
          <Send className="w-5 h-5" />
          ارسال تکلیف: {assignmentTitle}
        </CardTitle>
        <div className="text-sm text-muted-foreground font-vazir">
          مهلت ارسال: {new Date(dueDate).toLocaleDateString('fa-IR')}
          {isOverdue && (
            <span className="text-red-500 font-bold mr-2">
              (مهلت گذشته است)
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-vazir">محتوای تکلیف *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="پاسخ خود را اینجا بنویسید..."
                      className="min-h-32 font-vazir"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-vazir">توضیحات اضافی</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="توضیحات اختیاری..."
                      className="min-h-20 font-vazir"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* File Upload Section */}
            <div className="space-y-3">
              <FormLabel className="font-vazir">پیوست فایل (اختیاری)</FormLabel>
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  disabled={isUploading}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('file-upload')?.click()}
                  disabled={isUploading}
                  className="font-vazir"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                  ) : (
                    <Upload className="w-4 h-4 ml-2" />
                  )}
                  {isUploading ? "در حال آپلود..." : "انتخاب فایل"}
                </Button>
                {uploadedFile && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <FileText className="w-4 h-4" />
                    <span className="font-vazir">{uploadedFile.name}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground font-vazir">
                فرمت‌های مجاز: PDF, Word, تصویر | حداکثر حجم: 5MB
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={submitMutation.isPending || isOverdue}
                className="flex-1 font-vazir"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin ml-2" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 ml-2" />
                    ارسال تکلیف
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}