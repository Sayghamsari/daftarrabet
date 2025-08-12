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
import { 
  UserPlus, 
  Users, 
  Search, 
  Filter, 
  Calendar,
  User,
  School,
  BookOpen,
  Plus,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  GraduationCap
} from "lucide-react";

interface StudentTeacherAssignment {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  schoolName: string;
  classId?: string;
  className?: string;
  subject?: string;
  assignedBy: string;
  assignedByName: string;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  notes?: string;
}

const mockAssignments: StudentTeacherAssignment[] = [
  {
    id: "1",
    studentId: "student-001",
    studentName: "علی محمدی",
    teacherId: "teacher-001",
    teacherName: "خانم احمدی",
    schoolName: "دبیرستان شهید چمران",
    classId: "class-001",
    className: "نهم الف",
    subject: "ریاضی",
    assignedBy: "principal-001",
    assignedByName: "آقای حسینی (مدیر)",
    isActive: true,
    startDate: "2024-01-01",
    notes: "دانش‌آموز با استعداد در ریاضی"
  },
  {
    id: "2", 
    studentId: "student-002",
    studentName: "زهرا کریمی",
    teacherId: "teacher-002",
    teacherName: "آقای رضایی",
    schoolName: "دبیرستان شهید چمران",
    classId: "class-002",
    className: "هشتم ب",
    subject: "علوم",
    assignedBy: "vice-principal-001",
    assignedByName: "خانم موسوی (معاون)",
    isActive: true,
    startDate: "2024-01-01"
  },
  {
    id: "3",
    studentId: "student-003", 
    studentName: "محمد رضایی",
    teacherId: "teacher-003",
    teacherName: "خانم صادقی",
    schoolName: "دبیرستان شهید چمران",
    classId: "class-003",
    className: "دهم الف",
    subject: "ادبیات فارسی",
    assignedBy: "principal-001",
    assignedByName: "آقای حسینی (مدیر)",
    isActive: false,
    startDate: "2024-01-01",
    endDate: "2024-01-15",
    notes: "انتقال به معلم دیگر"
  }
];

export default function StudentTeacherAssignments() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTeacher, setFilterTeacher] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Check if user has permission to manage assignments
  const canManageAssignments = ["principal", "vice_principal"].includes(user.role);

  const filteredAssignments = mockAssignments.filter(assignment => {
    const matchesSearch = assignment.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.teacherName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && assignment.isActive) ||
                         (filterStatus === "inactive" && !assignment.isActive);
    const matchesTeacher = filterTeacher === "all" || assignment.teacherId === filterTeacher;
    
    return matchesSearch && matchesStatus && matchesTeacher;
  });

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
                مدیریت تخصیص دانش‌آموزان
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                تخصیص دانش‌آموزان به معلمان توسط مدیر و معاونین
              </p>
            </div>
            {canManageAssignments && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                    <Plus className="w-4 h-4 ml-2" />
                    تخصیص جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="font-shabnam text-right">تخصیص دانش‌آموز به معلم</DialogTitle>
                  </DialogHeader>
                  <AddAssignmentForm onClose={() => setIsAddDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل تخصیص‌ها</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">15</p>
                  </div>
                  <Users className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">فعال</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">12</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">غیرفعال</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">3</p>
                  </div>
                  <XCircle className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">معلمان</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">8</p>
                  </div>
                  <GraduationCap className="w-8 h-8 text-blue-600 opacity-75" />
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
                      placeholder="جستجو در تخصیص‌ها..."
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
                      <SelectItem value="inactive">غیرفعال</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterTeacher} onValueChange={setFilterTeacher}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir">
                      <SelectValue placeholder="معلم" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه معلمان</SelectItem>
                      <SelectItem value="teacher-001">خانم احمدی</SelectItem>
                      <SelectItem value="teacher-002">آقای رضایی</SelectItem>
                      <SelectItem value="teacher-003">خانم صادقی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignments List */}
          <div className="grid gap-4">
            {filteredAssignments.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ تخصیصی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredAssignments.map((assignment) => (
                <Card key={assignment.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <Badge className={`text-xs ${
                            assignment.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {assignment.isActive ? 'فعال' : 'غیرفعال'}
                          </Badge>
                          {assignment.subject && (
                            <Badge variant="outline" className="text-xs">
                              {assignment.subject}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm font-vazir mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-blue-500" />
                            <span className="font-medium">دانش‌آموز:</span>
                            <span>{assignment.studentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3 text-green-500" />
                            <span className="font-medium">معلم:</span>
                            <span>{assignment.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <School className="w-3 h-3 text-purple-500" />
                            <span className="font-medium">مدرسه:</span>
                            <span>{assignment.schoolName}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir">
                          {assignment.className && (
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              <span>کلاس: {assignment.className}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>شروع: {new Date(assignment.startDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>تخصیص‌دهنده: {assignment.assignedByName}</span>
                          </div>
                        </div>

                        {assignment.notes && (
                          <p className="text-sm text-muted-foreground mt-2 font-vazir">
                            یادداشت: {assignment.notes}
                          </p>
                        )}
                      </div>

                      {canManageAssignments && (
                        <div className="flex flex-row lg:flex-col gap-2">
                          <Button variant="outline" size="sm" className="font-vazir">
                            <Edit3 className="w-3 h-3 ml-1" />
                            ویرایش
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="font-vazir text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3 ml-1" />
                            حذف
                          </Button>
                        </div>
                      )}
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

function AddAssignmentForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    studentId: "",
    teacherId: "",
    classId: "",
    subject: "",
    startDate: "",
    endDate: "",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Assignment form submitted:", formData);
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
              <SelectItem value="student-003">محمد رضایی</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">معلم</Label>
          <Select value={formData.teacherId} onValueChange={(value) => setFormData({...formData, teacherId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب معلم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="teacher-001">خانم احمدی</SelectItem>
              <SelectItem value="teacher-002">آقای رضایی</SelectItem>
              <SelectItem value="teacher-003">خانم صادقی</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-shabnam">کلاس</Label>
          <Select value={formData.classId} onValueChange={(value) => setFormData({...formData, classId: value})}>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب کلاس" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="class-001">نهم الف</SelectItem>
              <SelectItem value="class-002">هشتم ب</SelectItem>
              <SelectItem value="class-003">دهم الف</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">درس</Label>
          <Input
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="font-vazir"
            placeholder="نام درس"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="font-shabnam">تاریخ شروع</Label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({...formData, startDate: e.target.value})}
            className="font-vazir"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">تاریخ پایان (اختیاری)</Label>
          <Input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({...formData, endDate: e.target.value})}
            className="font-vazir"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="font-shabnam">یادداشت</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          className="font-vazir min-h-16"
          placeholder="یادداشت‌های اضافی..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="font-vazir">
          انصراف
        </Button>
        <Button type="submit" className="gradient-primary text-white font-vazir">
          ثبت تخصیص
        </Button>
      </div>
    </form>
  );
}