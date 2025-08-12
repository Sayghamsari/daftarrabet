import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Link } from "wouter";
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter, 
  Clock,
  User,
  Eye,
  Edit3,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Upload,
  Download,
  ArrowLeft,
  Home
} from "lucide-react";

interface AbsenceRecord {
  id: string;
  date: string;
  period: string;
  subject: string;
  teacher: string;
  type: 'illness' | 'family' | 'personal' | 'emergency' | 'other';
  status: 'pending' | 'approved' | 'rejected' | 'requires_document';
  justificationText?: string;
  attachedDocument?: string;
  reviewedBy?: string;
  reviewDate?: string;
  reviewNote?: string;
  submissionDate: string;
}

const mockAbsences: AbsenceRecord[] = [
  {
    id: "1",
    date: "2024-01-15",
    period: "ساعت 2",
    subject: "ریاضی",
    teacher: "خانم احمدی",
    type: "illness",
    status: "approved",
    justificationText: "دلیل غیبت: تب و سرماخوردگی شدید که مانع از حضور در کلاس شده است.",
    attachedDocument: "medical_certificate_001.pdf",
    reviewedBy: "خانم موسوی (معاون)",
    reviewDate: "2024-01-16",
    reviewNote: "با ارائه گواهی پزشکی، غیبت موجه تلقی می‌شود.",
    submissionDate: "2024-01-15"
  },
  {
    id: "2", 
    date: "2024-01-12",
    period: "ساعت 1",
    subject: "فیزیک",
    teacher: "آقای رضایی",
    type: "family",
    status: "pending",
    justificationText: "حضور در مراسم خانوادگی ضروری و غیرقابل اجتناب.",
    submissionDate: "2024-01-13"
  },
  {
    id: "3",
    date: "2024-01-10", 
    period: "ساعت 3",
    subject: "شیمی",
    teacher: "دکتر حسینی",
    type: "personal",
    status: "requires_document",
    justificationText: "مراجعه به پزشک متخصص برای معاینه پزشکی.",
    reviewedBy: "آقای صادقی (مشاور)",
    reviewDate: "2024-01-11",
    reviewNote: "لطفاً گواهی پزشک را ارائه دهید.",
    submissionDate: "2024-01-10"
  }
];

export default function AbsenceJustification() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredAbsences = mockAbsences.filter(absence => {
    const matchesSearch = absence.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         absence.teacher.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || absence.status === filterStatus;
    const matchesType = filterType === "all" || absence.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
      requires_document: "bg-blue-100 text-blue-800"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      illness: "bg-red-100 text-red-800",
      family: "bg-blue-100 text-blue-800",
      personal: "bg-purple-100 text-purple-800",
      emergency: "bg-orange-100 text-orange-800",
      other: "bg-gray-100 text-gray-800"
    };
    return variants[type as keyof typeof variants] || variants.other;
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-white">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="font-vazir bg-white">
                    <Home className="w-4 h-4 ml-1" />
                    بازگشت به داشبورد
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                توجیه غیبت
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                ثبت و پیگیری درخواست‌های توجیه غیبت - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  درخواست توجیه جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">درخواست توجیه غیبت</DialogTitle>
                </DialogHeader>
                <AbsenceJustificationForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل درخواست‌ها</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">12</p>
                  </div>
                  <FileText className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-yellow-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">در انتظار بررسی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-yellow-600">3</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">تأیید شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">8</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-red-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">رد شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-red-600">1</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در درخواست‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="pending">در انتظار</SelectItem>
                      <SelectItem value="approved">تأیید شده</SelectItem>
                      <SelectItem value="rejected">رد شده</SelectItem>
                      <SelectItem value="requires_document">نیاز به مدرک</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="نوع غیبت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="illness">بیماری</SelectItem>
                      <SelectItem value="family">خانوادگی</SelectItem>
                      <SelectItem value="personal">شخصی</SelectItem>
                      <SelectItem value="emergency">اضطراری</SelectItem>
                      <SelectItem value="other">سایر</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Absence Records List */}
          <div className="grid gap-4">
            {filteredAbsences.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ درخواستی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredAbsences.map((absence) => (
                <Card key={absence.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {absence.subject} - {absence.period}
                          </h3>
                          <Badge className={`text-xs ${getStatusBadge(absence.status)}`}>
                            {absence.status === 'pending' && 'در انتظار بررسی'}
                            {absence.status === 'approved' && 'تأیید شده'}
                            {absence.status === 'rejected' && 'رد شده'}
                            {absence.status === 'requires_document' && 'نیاز به مدرک'}
                          </Badge>
                          <Badge className={`text-xs ${getTypeBadge(absence.type)}`}>
                            {absence.type === 'illness' && 'بیماری'}
                            {absence.type === 'family' && 'خانوادگی'}
                            {absence.type === 'personal' && 'شخصی'}
                            {absence.type === 'emergency' && 'اضطراری'}
                            {absence.type === 'other' && 'سایر'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 font-vazir">
                          {absence.justificationText}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>تاریخ: {new Date(absence.date).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>معلم: {absence.teacher}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>ارسال: {new Date(absence.submissionDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                        </div>

                        {absence.reviewNote && (
                          <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-xs font-shabnam text-blue-800 mb-1">نظر بررسی‌کننده:</p>
                            <p className="text-sm font-vazir text-blue-700">{absence.reviewNote}</p>
                            {absence.reviewedBy && (
                              <p className="text-xs font-vazir text-blue-600 mt-1">
                                بررسی شده توسط: {absence.reviewedBy}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <Eye className="w-3 h-3 ml-1" />
                              جزئیات
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات درخواست توجیه</DialogTitle>
                            </DialogHeader>
                            <AbsenceDetailsView absence={absence} />
                          </DialogContent>
                        </Dialog>
                        
                        {absence.status === 'pending' && (
                          <Button variant="outline" size="sm" className="font-vazir bg-white">
                            <Edit3 className="w-3 h-3 ml-1" />
                            ویرایش
                          </Button>
                        )}

                        {absence.attachedDocument && (
                          <Button variant="outline" size="sm" className="font-vazir bg-white">
                            <Download className="w-3 h-3 ml-1" />
                            دانلود
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AbsenceJustificationForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    date: "",
    period: "",
    subject: "",
    teacher: "",
    type: "illness",
    justificationText: "",
    attachedDocument: null as File | null
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Absence justification submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">تاریخ غیبت</Label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">ساعت درس</Label>
            <Select value={formData.period} onValueChange={(value) => setFormData({...formData, period: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="انتخاب ساعت" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="ساعت 1">ساعت 1</SelectItem>
                <SelectItem value="ساعت 2">ساعت 2</SelectItem>
                <SelectItem value="ساعت 3">ساعت 3</SelectItem>
                <SelectItem value="ساعت 4">ساعت 4</SelectItem>
                <SelectItem value="ساعت 5">ساعت 5</SelectItem>
                <SelectItem value="ساعت 6">ساعت 6</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نام درس</Label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="font-vazir bg-white"
              placeholder="مثل: ریاضی، فیزیک، شیمی"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نام معلم</Label>
            <Input
              value={formData.teacher}
              onChange={(e) => setFormData({...formData, teacher: e.target.value})}
              className="font-vazir bg-white"
              placeholder="نام کامل معلم درس"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">نوع غیبت</Label>
          <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
            <SelectTrigger className="bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="illness">بیماری</SelectItem>
              <SelectItem value="family">امور خانوادگی</SelectItem>
              <SelectItem value="personal">امور شخصی</SelectItem>
              <SelectItem value="emergency">اضطراری</SelectItem>
              <SelectItem value="other">سایر موارد</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">شرح دلیل غیبت</Label>
          <Textarea
            value={formData.justificationText}
            onChange={(e) => setFormData({...formData, justificationText: e.target.value})}
            className="font-vazir min-h-24 bg-white"
            placeholder="لطفاً دلیل غیبت خود را به طور کامل شرح دهید..."
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">ضمیمه مدرک (اختیاری)</Label>
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setFormData({...formData, attachedDocument: e.target.files?.[0] || null})}
              className="bg-white"
            />
            <Upload className="w-4 h-4 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground font-vazir">
            فرمت‌های مجاز: PDF، JPG، PNG (حداکثر 5 مگابایت)
          </p>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            ارسال درخواست
          </Button>
        </div>
      </form>
    </div>
  );
}

function AbsenceDetailsView({ absence }: { absence: AbsenceRecord }) {
  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ غیبت</Label>
              <p className="font-vazir font-medium">{new Date(absence.date).toLocaleDateString('fa-IR')}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">ساعت درس</Label>
              <p className="font-vazir font-medium">{absence.period}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نام درس</Label>
              <p className="font-vazir font-medium">{absence.subject}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نام معلم</Label>
              <p className="font-vazir font-medium">{absence.teacher}</p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">دلیل غیبت</Label>
            <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg">{absence.justificationText}</p>
          </div>

          {absence.attachedDocument && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">مدرک ضمیمه</Label>
              <div className="flex items-center gap-2 mt-1">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="font-vazir text-sm">{absence.attachedDocument}</span>
                <Button variant="outline" size="sm" className="font-vazir bg-white">
                  <Download className="w-3 h-3 ml-1" />
                  دانلود
                </Button>
              </div>
            </div>
          )}

          {absence.reviewNote && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">نظر بررسی‌کننده</Label>
              <p className="font-vazir text-sm mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                {absence.reviewNote}
              </p>
              {absence.reviewedBy && (
                <p className="text-xs font-vazir text-muted-foreground mt-1">
                  بررسی شده توسط: {absence.reviewedBy} در تاریخ {absence.reviewDate && new Date(absence.reviewDate).toLocaleDateString('fa-IR')}
                </p>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge className={`${getStatusBadge(absence.status)}`}>
              {absence.status === 'pending' && 'در انتظار بررسی'}
              {absence.status === 'approved' && 'تأیید شده'}
              {absence.status === 'rejected' && 'رد شده'}
              {absence.status === 'requires_document' && 'نیاز به مدرک'}
            </Badge>
            <Badge className={`${getTypeBadge(absence.type)}`}>
              {absence.type === 'illness' && 'بیماری'}
              {absence.type === 'family' && 'خانوادگی'}
              {absence.type === 'personal' && 'شخصی'}
              {absence.type === 'emergency' && 'اضطراری'}
              {absence.type === 'other' && 'سایر'}
            </Badge>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function getStatusBadge(status: string) {
  const variants = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    requires_document: "bg-blue-100 text-blue-800"
  };
  return variants[status as keyof typeof variants] || variants.pending;
}

function getTypeBadge(type: string) {
  const variants = {
    illness: "bg-red-100 text-red-800",
    family: "bg-blue-100 text-blue-800",
    personal: "bg-purple-100 text-purple-800",
    emergency: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };
  return variants[type as keyof typeof variants] || variants.other;
}