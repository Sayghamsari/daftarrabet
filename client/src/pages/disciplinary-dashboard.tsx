import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  MessageSquare,
  Bell,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

interface DisciplinaryRecord {
  id: string;
  studentId: string;
  studentName: string;
  teacherId?: string;
  teacherName?: string;
  classId?: string;
  className?: string;
  incidentType: string;
  severity: 'minor' | 'moderate' | 'major' | 'severe';
  title: string;
  description: string;
  actionTaken?: string;
  parentNotified: boolean;
  resolved: boolean;
  incidentDate: string;
  reportDate: string;
  followUpDate?: string;
  notes?: string;
  status: 'active' | 'resolved' | 'dismissed';
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

const mockDisciplinaryRecords: DisciplinaryRecord[] = [
  {
    id: "1",
    studentId: "student-001",
    studentName: "علی محمدی",
    teacherId: "teacher-001", 
    teacherName: "خانم احمدی",
    classId: "class-001",
    className: "ریاضی پایه نهم - دبیرستان شهید چمران",
    incidentType: "تأخیر",
    severity: "minor",
    title: "تأخیر در حضور به کلاس",
    description: "دانش‌آموز 15 دقیقه با تأخیر وارد کلاس شد",
    actionTaken: "هشدار کلامی داده شد",
    parentNotified: true,
    resolved: false,
    incidentDate: "2024-01-15",
    reportDate: "2024-01-15",
    status: "active",
    priority: "low"
  },
  {
    id: "2",
    studentId: "student-002",
    studentName: "زهرا کریمی",
    teacherId: "teacher-002",
    teacherName: "آقای رضایی",
    classId: "class-002", 
    className: "علوم پایه هشتم - دبیرستان شهید چمران",
    incidentType: "اختلال در کلاس",
    severity: "moderate",
    title: "صحبت بی‌مورد در کلاس",
    description: "دانش‌آموز مکرراً در حین تدریس صحبت می‌کرد",
    actionTaken: "از کلاس اخراج و به دفتر فرستاده شد",
    parentNotified: true,
    resolved: true,
    incidentDate: "2024-01-14",
    reportDate: "2024-01-14",
    followUpDate: "2024-01-16",
    status: "resolved",
    priority: "normal"
  },
  {
    id: "3",
    studentId: "student-003",
    studentName: "محمد رضایی",
    teacherId: "teacher-003",
    teacherName: "خانم صادقی",
    classId: "class-003",
    className: "ادبیات پایه دهم - دبیرستان شهید چمران",
    incidentType: "غیبت غیرموجه",
    severity: "major",
    title: "غیبت مکرر از کلاس",
    description: "دانش‌آموز بدون اجازه از کلاس غایب شده است",
    actionTaken: "تماس با والدین و احضار به دفتر",
    parentNotified: true,
    resolved: false,
    incidentDate: "2024-01-16",
    reportDate: "2024-01-16",
    status: "active",
    priority: "high"
  },
  {
    id: "4",
    studentId: "student-004",
    studentName: "فاطمه احمدی",
    teacherId: "teacher-001",
    teacherName: "خانم احمدی",
    classId: "class-001",
    className: "ریاضی پایه نهم - دبیرستان شهید چمران",
    incidentType: "عدم انجام تکلیف",
    severity: "minor",
    title: "عدم انجام تکالیف مکرر",
    description: "دانش‌آموز سه جلسه متوالی تکلیف نیاورده است",
    actionTaken: "توضیح داده شد و فرصت جبران داده شد",
    parentNotified: false,
    resolved: true,
    incidentDate: "2024-01-13",
    reportDate: "2024-01-13",
    followUpDate: "2024-01-15",
    status: "resolved",
    priority: "normal"
  }
];

export default function DisciplinaryDashboard() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<DisciplinaryRecord | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredRecords = mockDisciplinaryRecords.filter(record => {
    const matchesSearch = record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || record.status === filterStatus;
    const matchesSeverity = filterSeverity === "all" || record.severity === filterSeverity;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const getSeverityBadge = (severity: string) => {
    const variants = {
      minor: "bg-green-100 text-green-800",
      moderate: "bg-yellow-100 text-yellow-800", 
      major: "bg-orange-100 text-orange-800",
      severe: "bg-red-100 text-red-800"
    };
    return variants[severity as keyof typeof variants] || variants.minor;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
      dismissed: "bg-gray-100 text-gray-800"
    };
    return variants[status as keyof typeof variants] || variants.active;
  };

  const getPriorityIcon = (priority: string) => {
    switch(priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'high': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'normal': return <Clock className="w-4 h-4 text-blue-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                مدیریت امور انضباطی
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                ثبت و پیگیری موارد انضباطی دانش‌آموزان
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  ثبت مورد جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">ثبت مورد انضباطی جدید</DialogTitle>
                </DialogHeader>
                <AddDisciplinaryForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل موارد</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">12</p>
                  </div>
                  <Shield className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">در انتظار بررسی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">3</p>
                  </div>
                  <Clock className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-red-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">موارد جدی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-red-600">2</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">حل شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">7</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute right-3 top-3 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در موارد انضباطی..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="active">فعال</SelectItem>
                      <SelectItem value="resolved">حل شده</SelectItem>
                      <SelectItem value="dismissed">رد شده</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir">
                      <SelectValue placeholder="شدت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه سطوح</SelectItem>
                      <SelectItem value="minor">جزئی</SelectItem>
                      <SelectItem value="moderate">متوسط</SelectItem>
                      <SelectItem value="major">مهم</SelectItem>
                      <SelectItem value="severe">جدی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Records List */}
          <div className="grid gap-4">
            {filteredRecords.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ موردی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredRecords.map((record) => (
                <Card key={record.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getPriorityIcon(record.priority)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">{record.title}</h3>
                          <Badge className={`text-xs ${getSeverityBadge(record.severity)}`}>
                            {record.severity === 'minor' && 'جزئی'}
                            {record.severity === 'moderate' && 'متوسط'} 
                            {record.severity === 'major' && 'مهم'}
                            {record.severity === 'severe' && 'جدی'}
                          </Badge>
                          <Badge className={`text-xs ${getStatusBadge(record.status)}`}>
                            {record.status === 'active' && 'فعال'}
                            {record.status === 'resolved' && 'حل شده'}
                            {record.status === 'dismissed' && 'رد شده'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{record.studentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(record.incidentDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          {record.className && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>{record.className}</span>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mt-2 font-vazir line-clamp-2">
                          {record.description}
                        </p>
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir">
                              <Eye className="w-3 h-3 ml-1" />
                              مشاهده
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات مورد انضباطی</DialogTitle>
                            </DialogHeader>
                            <RecordDetailsView record={record} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="font-vazir">
                          <Edit3 className="w-3 h-3 ml-1" />
                          ویرایش
                        </Button>
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

function AddDisciplinaryForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    studentId: "",
    incidentType: "",
    severity: "minor",
    title: "",
    description: "",
    incidentDate: "",
    priority: "normal"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-shabnam">دانش‌آموز</Label>
          <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دانش‌آموز" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="student-001">علی محمدی</SelectItem>
              <SelectItem value="student-002">زهرا کریمی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">نوع واقعه</Label>
          <Select value={formData.incidentType} onValueChange={(value) => setFormData({...formData, incidentType: value})}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب نوع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tardiness">تأخیر</SelectItem>
              <SelectItem value="absence">غیبت</SelectItem>
              <SelectItem value="disruption">اختلال در کلاس</SelectItem>
              <SelectItem value="misconduct">رفتار نامناسب</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-shabnam">شدت</Label>
          <Select value={formData.severity} onValueChange={(value) => setFormData({...formData, severity: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="minor">جزئی</SelectItem>
              <SelectItem value="moderate">متوسط</SelectItem>
              <SelectItem value="major">مهم</SelectItem>
              <SelectItem value="severe">جدی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">اولویت</Label>
          <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">کم</SelectItem>
              <SelectItem value="normal">عادی</SelectItem>
              <SelectItem value="high">زیاد</SelectItem>
              <SelectItem value="urgent">فوری</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-shabnam">عنوان</Label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({...formData, title: e.target.value})}
          className="font-vazir"
          placeholder="عنوان مورد انضباطی"
        />
      </div>

      <div className="space-y-2">
        <Label className="font-shabnam">توضیحات</Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="font-vazir min-h-20"
          placeholder="توضیحات کامل واقعه..."
        />
      </div>

      <div className="space-y-2">
        <Label className="font-shabnam">تاریخ واقعه</Label>
        <Input
          type="date"
          value={formData.incidentDate}
          onChange={(e) => setFormData({...formData, incidentDate: e.target.value})}
          className="font-vazir"
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="font-vazir">
          انصراف
        </Button>
        <Button type="submit" className="gradient-primary text-white font-vazir">
          ثبت مورد
        </Button>
      </div>
    </form>
  );
}

function RecordDetailsView({ record }: { record: DisciplinaryRecord }) {
  return (
    <ScrollArea className="max-h-96">
      <div className="space-y-4 p-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">دانش‌آموز</Label>
            <p className="font-vazir font-medium">{record.studentName}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">معلم گزارش‌دهنده</Label>
            <p className="font-vazir font-medium">{record.teacherName || 'نامشخص'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">کلاس</Label>
            <p className="font-vazir font-medium">{record.className || 'نامشخص'}</p>
          </div>
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">تاریخ واقعه</Label>
            <p className="font-vazir font-medium">{new Date(record.incidentDate).toLocaleDateString('fa-IR')}</p>
          </div>
        </div>

        <Separator />

        <div>
          <Label className="font-shabnam text-sm text-muted-foreground">عنوان</Label>
          <p className="font-vazir font-medium">{record.title}</p>
        </div>

        <div>
          <Label className="font-shabnam text-sm text-muted-foreground">توضیحات</Label>
          <p className="font-vazir text-sm">{record.description}</p>
        </div>

        {record.actionTaken && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">اقدام انجام شده</Label>
            <p className="font-vazir text-sm">{record.actionTaken}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Badge className={`${getSeverityBadge(record.severity)}`}>
            {record.severity === 'minor' && 'جزئی'}
            {record.severity === 'moderate' && 'متوسط'} 
            {record.severity === 'major' && 'مهم'}
            {record.severity === 'severe' && 'جدی'}
          </Badge>
          <Badge className={`${getStatusBadge(record.status)}`}>
            {record.status === 'active' && 'فعال'}
            {record.status === 'resolved' && 'حل شده'}
            {record.status === 'dismissed' && 'رد شده'}
          </Badge>
          {record.parentNotified && (
            <Badge className="bg-blue-100 text-blue-800">
              والدین مطلع شده‌اند
            </Badge>
          )}
        </div>

        {record.notes && (
          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">یادداشت‌ها</Label>
            <p className="font-vazir text-sm">{record.notes}</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

function getSeverityBadge(severity: string) {
  const variants = {
    minor: "bg-green-100 text-green-800",
    moderate: "bg-yellow-100 text-yellow-800", 
    major: "bg-orange-100 text-orange-800",
    severe: "bg-red-100 text-red-800"
  };
  return variants[severity as keyof typeof variants] || variants.minor;
}

function getStatusBadge(status: string) {
  const variants = {
    active: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
    dismissed: "bg-gray-100 text-gray-800"
  };
  return variants[status as keyof typeof variants] || variants.active;
}