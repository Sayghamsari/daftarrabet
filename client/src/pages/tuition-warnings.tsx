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
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  Send,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  School
} from "lucide-react";

interface TuitionWarning {
  id: string;
  studentId: string;
  studentName: string;
  parentId?: string;
  parentName?: string;
  parentPhone?: string;
  schoolName: string;
  amount: number;
  dueDate: string;
  warningType: 'overdue' | 'upcoming' | 'final';
  status: 'pending' | 'paid' | 'overdue';
  sentAt: string;
  paidAt?: string;
  notes?: string;
}

const mockTuitionWarnings: TuitionWarning[] = [
  {
    id: "1",
    studentId: "student-001",
    studentName: "علی محمدی",
    parentId: "parent-001",
    parentName: "احمد محمدی",
    parentPhone: "09121234567",
    schoolName: "دبیرستان شهید چمران",
    amount: 2500000,
    dueDate: "2024-01-20",
    warningType: "overdue",
    status: "overdue",
    sentAt: "2024-01-15",
    notes: "شهریه ترم اول"
  },
  {
    id: "2",
    studentId: "student-002",
    studentName: "زهرا کریمی",
    parentId: "parent-002",
    parentName: "فاطمه کریمی",
    parentPhone: "09121234568",
    schoolName: "دبیرستان شهید چمران",
    amount: 2500000,
    dueDate: "2024-01-25",
    warningType: "upcoming",
    status: "pending",
    sentAt: "2024-01-16"
  },
  {
    id: "3",
    studentId: "student-003",
    studentName: "محمد رضایی",
    parentId: "parent-003",
    parentName: "علی رضایی",
    parentPhone: "09121234569",
    schoolName: "دبیرستان شهید چمران",
    amount: 2500000,
    dueDate: "2024-01-10",
    warningType: "final",
    status: "paid",
    sentAt: "2024-01-12",
    paidAt: "2024-01-14",
    notes: "پرداخت شده"
  }
];

export default function TuitionWarnings() {
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

  const filteredWarnings = mockTuitionWarnings.filter(warning => {
    const matchesSearch = warning.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         warning.parentName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || warning.status === filterStatus;
    const matchesType = filterType === "all" || warning.warningType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      paid: "bg-green-100 text-green-800",
      overdue: "bg-red-100 text-red-800"
    };
    return variants[status as keyof typeof variants] || variants.pending;
  };

  const getTypeBadge = (type: string) => {
    const variants = {
      upcoming: "bg-blue-100 text-blue-800",
      overdue: "bg-red-100 text-red-800",
      final: "bg-purple-100 text-purple-800"
    };
    return variants[type as keyof typeof variants] || variants.upcoming;
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
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
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                هشدارهای شهریه
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                مدیریت هشدارهای شهریه برای والدین - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  ایجاد هشدار جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">ایجاد هشدار شهریه جدید</DialogTitle>
                </DialogHeader>
                <AddWarningForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل هشدارها</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">24</p>
                  </div>
                  <CreditCard className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-red-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">معوقه</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-red-600">8</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-yellow-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">در انتظار</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-yellow-600">11</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">پرداخت شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">5</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
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
                      placeholder="جستجو در هشدارهای شهریه..."
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
                      <SelectItem value="paid">پرداخت شده</SelectItem>
                      <SelectItem value="overdue">معوقه</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="نوع هشدار" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="upcoming">پیش‌رو</SelectItem>
                      <SelectItem value="overdue">معوقه</SelectItem>
                      <SelectItem value="final">نهایی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warnings List */}
          <div className="grid gap-4">
            {filteredWarnings.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ هشداری یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredWarnings.map((warning) => (
                <Card key={warning.id} className="hover:shadow-md transition-shadow bg-white">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {formatAmount(warning.amount)}
                          </h3>
                          <Badge className={`text-xs ${getStatusBadge(warning.status)}`}>
                            {warning.status === 'pending' && 'در انتظار'}
                            {warning.status === 'paid' && 'پرداخت شده'}
                            {warning.status === 'overdue' && 'معوقه'}
                          </Badge>
                          <Badge className={`text-xs ${getTypeBadge(warning.warningType)}`}>
                            {warning.warningType === 'upcoming' && 'پیش‌رو'}
                            {warning.warningType === 'overdue' && 'معوقه'}
                            {warning.warningType === 'final' && 'نهایی'}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir mb-2">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{warning.studentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-blue-500" />
                            <span>{warning.parentName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <School className="w-3 h-3 text-purple-500" />
                            <span>{warning.schoolName}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>موعد: {new Date(warning.dueDate).toLocaleDateString('fa-IR')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>ارسال: {new Date(warning.sentAt).toLocaleDateString('fa-IR')}</span>
                          </div>
                          {warning.parentPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              <span>{warning.parentPhone}</span>
                            </div>
                          )}
                        </div>

                        {warning.notes && (
                          <p className="text-sm text-muted-foreground mt-2 font-vazir">
                            یادداشت: {warning.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-row lg:flex-col gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <Eye className="w-3 h-3 ml-1" />
                              مشاهده
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader>
                              <DialogTitle className="font-shabnam text-right">جزئیات هشدار شهریه</DialogTitle>
                            </DialogHeader>
                            <WarningDetailsView warning={warning} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="font-vazir bg-white">
                          <Send className="w-3 h-3 ml-1" />
                          ارسال مجدد
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

function AddWarningForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    dueDate: "",
    warningType: "upcoming",
    notes: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Warning form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">دانش‌آموز</Label>
            <Select value={formData.studentId} onValueChange={(value) => setFormData({...formData, studentId: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="انتخاب دانش‌آموز" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="student-001">علی محمدی</SelectItem>
                <SelectItem value="student-002">زهرا کریمی</SelectItem>
                <SelectItem value="student-003">محمد رضایی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">نوع هشدار</Label>
            <Select value={formData.warningType} onValueChange={(value) => setFormData({...formData, warningType: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="upcoming">پیش‌رو</SelectItem>
                <SelectItem value="overdue">معوقه</SelectItem>
                <SelectItem value="final">نهایی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">مبلغ (تومان)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="font-vazir bg-white"
              placeholder="2500000"
            />
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">تاریخ سررسید</Label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              className="font-vazir bg-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">یادداشت</Label>
          <Textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            className="font-vazir min-h-16 bg-white"
            placeholder="یادداشت‌های اضافی..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            ایجاد هشدار
          </Button>
        </div>
      </form>
    </div>
  );
}

function WarningDetailsView({ warning }: { warning: TuitionWarning }) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
  };

  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">دانش‌آموز</Label>
              <p className="font-vazir font-medium">{warning.studentName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">والدین</Label>
              <p className="font-vazir font-medium">{warning.parentName || 'نامشخص'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">مبلغ</Label>
              <p className="font-vazir font-medium text-green-600">{formatAmount(warning.amount)}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ سررسید</Label>
              <p className="font-vazir font-medium">{new Date(warning.dueDate).toLocaleDateString('fa-IR')}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ ارسال</Label>
              <p className="font-vazir font-medium">{new Date(warning.sentAt).toLocaleDateString('fa-IR')}</p>
            </div>
            {warning.paidAt && (
              <div>
                <Label className="font-shabnam text-sm text-muted-foreground">تاریخ پرداخت</Label>
                <p className="font-vazir font-medium text-green-600">{new Date(warning.paidAt).toLocaleDateString('fa-IR')}</p>
              </div>
            )}
          </div>

          {warning.parentPhone && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">شماره تماس والدین</Label>
              <p className="font-vazir font-medium">{warning.parentPhone}</p>
            </div>
          )}

          {warning.notes && (
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">یادداشت‌ها</Label>
              <p className="font-vazir text-sm">{warning.notes}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Badge className={`${getStatusBadge(warning.status)}`}>
              {warning.status === 'pending' && 'در انتظار'}
              {warning.status === 'paid' && 'پرداخت شده'}
              {warning.status === 'overdue' && 'معوقه'}
            </Badge>
            <Badge className={`${getTypeBadge(warning.warningType)}`}>
              {warning.warningType === 'upcoming' && 'پیش‌رو'}
              {warning.warningType === 'overdue' && 'معوقه'}
              {warning.warningType === 'final' && 'نهایی'}
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
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800"
  };
  return variants[status as keyof typeof variants] || variants.pending;
}

function getTypeBadge(type: string) {
  const variants = {
    upcoming: "bg-blue-100 text-blue-800",
    overdue: "bg-red-100 text-red-800",
    final: "bg-purple-100 text-purple-800"
  };
  return variants[type as keyof typeof variants] || variants.upcoming;
}