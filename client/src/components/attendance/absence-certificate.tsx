import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Upload, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const certificateSchema = z.object({
  studentId: z.string().min(1, "انتخاب دانش‌آموز الزامی است"),
  absenceDate: z.string().min(1, "تاریخ غیبت الزامی است"),
  absenceType: z.enum(["sick", "emergency", "family", "other"], {
    required_error: "نوع غیبت را انتخاب کنید"
  }),
  reason: z.string().min(10, "دلیل غیبت باید حداقل 10 کاراکتر باشد"),
  attachmentUrl: z.string().optional(),
  parentSignature: z.string().min(1, "امضای والدین الزامی است")
});

type CertificateFormData = z.infer<typeof certificateSchema>;

interface AbsenceCertificate {
  id: string;
  studentName: string;
  absenceDate: string;
  absenceType: string;
  reason: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export function AbsenceCertificateManager() {
  const [certificates, setCertificates] = useState<AbsenceCertificate[]>([
    {
      id: "1",
      studentName: "علی احمدی",
      absenceDate: "2024-08-10",
      absenceType: "sick",
      reason: "تب و سرماخوردگی شدید",
      status: "pending",
      submittedAt: "2024-08-11T08:00:00Z"
    },
    {
      id: "2", 
      studentName: "فاطمه کریمی",
      absenceDate: "2024-08-09",
      absenceType: "emergency",
      reason: "مراجعه اورژانسی به بیمارستان",
      status: "approved",
      submittedAt: "2024-08-10T10:30:00Z",
      reviewedBy: "احمد نوری",
      reviewedAt: "2024-08-11T14:00:00Z"
    }
  ]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      studentId: "",
      absenceDate: "",
      absenceType: "sick",
      reason: "",
      attachmentUrl: "",
      parentSignature: ""
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: CertificateFormData) => {
      const response = await apiRequest("POST", "/api/absence-certificates", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "گواهی غیبت با موفقیت ارسال شد",
        variant: "default"
      });
      form.reset();
      setShowForm(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در ارسال گواهی",
        variant: "destructive"
      });
    }
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: "approved" | "rejected", notes: string }) => {
      const response = await apiRequest("PUT", `/api/absence-certificates/${id}/review`, { status, notes });
      return response.json();
    },
    onSuccess: (_, variables) => {
      setCertificates(prev => prev.map(cert => 
        cert.id === variables.id 
          ? { 
              ...cert, 
              status: variables.status, 
              reviewedAt: new Date().toISOString(),
              reviewedBy: "معاون آموزشی",
              reviewNotes: variables.notes
            }
          : cert
      ));
      toast({
        title: "موفقیت",
        description: `گواهی ${variables.status === 'approved' ? 'تایید' : 'رد'} شد`,
        variant: "default"
      });
    }
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, label: "در انتظار بررسی", icon: Clock },
      approved: { variant: "default" as const, label: "تایید شده", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "رد شده", icon: XCircle }
    };
    const config = statusMap[status as keyof typeof statusMap];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="font-vazir">
        <Icon className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const getAbsenceTypeLabel = (type: string) => {
    const typeMap = {
      sick: "بیماری",
      emergency: "اورژانس",
      family: "خانوادگی",
      other: "سایر موارد"
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  return (
    <div className="space-y-6">
      {/* Form Toggle */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-shabnam font-bold">مدیریت گواهی غیبت</h2>
        <Button onClick={() => setShowForm(!showForm)} className="font-vazir">
          <FileText className="w-4 h-4 ml-2" />
          {showForm ? "بستن فرم" : "ثبت گواهی جدید"}
        </Button>
      </div>

      {/* Submission Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="font-shabnam">ثبت گواهی غیبت</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => submitMutation.mutate(data))} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <SelectItem value="student1">علی احمدی</SelectItem>
                            <SelectItem value="student2">فاطمه کریمی</SelectItem>
                            <SelectItem value="student3">محمد رضایی</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="absenceDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-vazir">تاریخ غیبت</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="absenceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">نوع غیبت</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sick">بیماری</SelectItem>
                          <SelectItem value="emergency">اورژانس</SelectItem>
                          <SelectItem value="family">خانوادگی</SelectItem>
                          <SelectItem value="other">سایر موارد</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">دلیل غیبت</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="دلیل کامل غیبت را شرح دهید..."
                          className="font-vazir"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="parentSignature"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-vazir">نام و امضای والدین</FormLabel>
                      <FormControl>
                        <Input placeholder="نام کامل والدین" {...field} className="font-vazir" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button 
                    type="submit" 
                    disabled={submitMutation.isPending}
                    className="font-vazir"
                  >
                    {submitMutation.isPending ? "در حال ارسال..." : "ارسال گواهی"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    انصراف
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}

      {/* Certificates List */}
      <div className="space-y-4">
        <h3 className="text-lg font-shabnam font-semibold">لیست گواهی‌ها</h3>
        {certificates.map((certificate) => (
          <Card key={certificate.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-vazir font-semibold">{certificate.studentName}</h4>
                  <p className="text-sm text-muted-foreground font-vazir">
                    تاریخ غیبت: {new Date(certificate.absenceDate).toLocaleDateString('fa-IR')}
                  </p>
                </div>
                {getStatusBadge(certificate.status)}
              </div>
              
              <div className="space-y-2 text-sm">
                <p className="font-vazir">
                  <span className="font-medium">نوع غیبت:</span> {getAbsenceTypeLabel(certificate.absenceType)}
                </p>
                <p className="font-vazir">
                  <span className="font-medium">دلیل:</span> {certificate.reason}
                </p>
              </div>

              {certificate.status === "pending" && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => reviewMutation.mutate({ 
                      id: certificate.id, 
                      status: "approved", 
                      notes: "تایید شده" 
                    })}
                    className="font-vazir"
                  >
                    <CheckCircle className="w-4 h-4 ml-1" />
                    تایید
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => reviewMutation.mutate({ 
                      id: certificate.id, 
                      status: "rejected", 
                      notes: "مدارک کافی نیست" 
                    })}
                    className="font-vazir"
                  >
                    <XCircle className="w-4 h-4 ml-1" />
                    رد
                  </Button>
                </div>
              )}

              {certificate.reviewedAt && (
                <div className="mt-3 p-3 bg-muted rounded-lg text-sm">
                  <p className="font-vazir">
                    <span className="font-medium">بررسی شده توسط:</span> {certificate.reviewedBy}
                  </p>
                  <p className="font-vazir">
                    <span className="font-medium">زمان بررسی:</span> {new Date(certificate.reviewedAt).toLocaleString('fa-IR')}
                  </p>
                  {certificate.reviewNotes && (
                    <p className="font-vazir">
                      <span className="font-medium">یادداشت:</span> {certificate.reviewNotes}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}