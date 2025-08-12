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
  Bell, 
  Plus, 
  Search, 
  Filter, 
  Calendar,
  User,
  Eye,
  Edit3,
  Send,
  MessageSquare,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Info,
  Mail,
  Users,
  School,
  Trash2
} from "lucide-react";

interface Notification {
  id: string;
  type: 'disciplinary' | 'academic' | 'general' | 'tuition' | 'achievement';
  title: string;
  message: string;
  recipientId: string;
  recipientName: string;
  recipientType: 'student' | 'parent' | 'teacher';
  senderId: string;
  senderName: string;
  schoolName: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: 'draft' | 'sent' | 'read' | 'unread';
  sentAt?: string;
  readAt?: string;
  isRead: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "disciplinary",
    title: "هشدار انضباطی - تأخیر مکرر",
    message: "فرزند شما در هفته گذشته سه بار با تأخیر وارد کلاس شده است. برای جبران این موضوع پیشنهاد می‌شود که برنامه زمانی روزانه او را بازنگری کنید و ساعت خواب را زودتر تنظیم نمایید.",
    recipientId: "parent-001",
    recipientName: "احمد محمدی (والد)",
    recipientType: "parent",
    senderId: "teacher-001", 
    senderName: "خانم احمدی",
    schoolName: "دبیرستان شهید چمران",
    priority: "high",
    status: "sent",
    sentAt: "2024-01-15T10:30:00",
    isRead: false
  },
  {
    id: "2",
    type: "achievement",
    title: "کسب کارت امتیاز - عملکرد برتر",
    message: "تبریک! فرزند شما کارت امتیاز 'برترین دانش‌آموز ریاضی' را کسب کرده است. این دستاورد نشان از تلاش و پیشرفت چشمگیر او در درس ریاضیات می‌باشد.",
    recipientId: "parent-002",
    recipientName: "فاطمه کریمی (والد)",
    recipientType: "parent",
    senderId: "teacher-002",
    senderName: "آقای رضایی",
    schoolName: "دبیرستان شهید چمران",
    priority: "normal",
    status: "read",
    sentAt: "2024-01-14T14:20:00",
    readAt: "2024-01-14T15:45:00",
    isRead: true
  },
  {
    id: "3",
    type: "tuition",
    title: "یادآوری پرداخت شهریه",
    message: "شهریه ترم جاری فرزند شما تا تاریخ 25 بهمن ماه سررسید پرداخت می‌باشد. لطفاً جهت جلوگیری از تأخیر در خدمات آموزشی، نسبت به پرداخت آن اقدام فرمایید.",
    recipientId: "parent-003",
    recipientName: "علی رضایی (والد)",
    recipientType: "parent",
    senderId: "vice-principal-001",
    senderName: "خانم موسوی (معاون)",
    schoolName: "دبیرستان شهید چمران",
    priority: "urgent",
    status: "unread",
    sentAt: "2024-01-16T09:15:00",
    isRead: false
  },
  {
    id: "4",
    type: "academic",
    title: "دعوت به جلسه مشاوره تحصیلی",
    message: "با توجه به وضعیت تحصیلی فرزند شما، از شما دعوت می‌شود جهت بررسی راهکارهای بهبود عملکرد در روز چهارشنبه ساعت 10 صبح در دفتر مشاوره حضور یابید.",
    recipientId: "parent-004",
    recipientName: "مریم احمدی (والد)",
    recipientType: "parent",
    senderId: "counselor-001",
    senderName: "آقای صادقی (مشاور)",
    schoolName: "دبیرستان شهید چمران",
    priority: "normal",
    status: "sent",
    sentAt: "2024-01-13T16:00:00",
    isRead: false
  }
];

export default function Notifications() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const filteredNotifications = mockNotifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || notification.type === filterType;
    const matchesStatus = filterStatus === "all" || notification.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeBadge = (type: string) => {
    const variants = {
      disciplinary: "bg-red-100 text-red-800",
      academic: "bg-blue-100 text-blue-800",
      general: "bg-gray-100 text-gray-800",
      tuition: "bg-orange-100 text-orange-800",
      achievement: "bg-green-100 text-green-800"
    };
    return variants[type as keyof typeof variants] || variants.general;
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      normal: "bg-blue-100 text-blue-800", 
      high: "bg-yellow-100 text-yellow-800",
      urgent: "bg-red-100 text-red-800"
    };
    return variants[priority as keyof typeof variants] || variants.normal;
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'disciplinary': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'academic': return <Users className="w-4 h-4 text-blue-500" />;
      case 'achievement': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'tuition': return <Bell className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-gray-500" />;
    }
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
                اعلانات و پیام‌ها
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                مدیریت اعلانات و پیام‌های سیستم - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  ارسال پیام جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">ارسال پیام جدید</DialogTitle>
                </DialogHeader>
                <AddNotificationForm onClose={() => setIsAddDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کل پیام‌ها</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">156</p>
                  </div>
                  <Bell className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-red-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">فوری</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-red-600">8</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-red-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">ارسال شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">124</p>
                  </div>
                  <Send className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">خوانده شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">98</p>
                  </div>
                  <Eye className="w-8 h-8 text-green-600 opacity-75" />
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
                      placeholder="جستجو در پیام‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 font-vazir bg-white"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="نوع پیام" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه انواع</SelectItem>
                      <SelectItem value="disciplinary">انضباطی</SelectItem>
                      <SelectItem value="academic">تحصیلی</SelectItem>
                      <SelectItem value="achievement">دستاورد</SelectItem>
                      <SelectItem value="tuition">شهریه</SelectItem>
                      <SelectItem value="general">عمومی</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="draft">پیش‌نویس</SelectItem>
                      <SelectItem value="sent">ارسال شده</SelectItem>
                      <SelectItem value="read">خوانده شده</SelectItem>
                      <SelectItem value="unread">خوانده نشده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications List */}
          <div className="grid gap-4">
            {filteredNotifications.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ پیامی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card key={notification.id} className={`hover:shadow-md transition-shadow bg-white ${!notification.isRead ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          {getTypeIcon(notification.type)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {notification.title}
                          </h3>
                          {!notification.isRead && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">جدید</Badge>
                          )}
                          <Badge className={`text-xs ${getTypeBadge(notification.type)}`}>
                            {notification.type === 'disciplinary' && 'انضباطی'}
                            {notification.type === 'academic' && 'تحصیلی'}
                            {notification.type === 'achievement' && 'دستاورد'}
                            {notification.type === 'tuition' && 'شهریه'}
                            {notification.type === 'general' && 'عمومی'}
                          </Badge>
                          <Badge className={`text-xs ${getPriorityBadge(notification.priority)}`}>
                            {notification.priority === 'low' && 'کم'}
                            {notification.priority === 'normal' && 'عادی'}
                            {notification.priority === 'high' && 'بالا'}
                            {notification.priority === 'urgent' && 'فوری'}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 font-vazir line-clamp-2">
                          {notification.message}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-muted-foreground font-vazir">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            <span>{notification.recipientName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span>از: {notification.senderName}</span>
                          </div>
                          {notification.sentAt && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{new Date(notification.sentAt).toLocaleDateString('fa-IR')}</span>
                            </div>
                          )}
                        </div>
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
                              <DialogTitle className="font-shabnam text-right">جزئیات پیام</DialogTitle>
                            </DialogHeader>
                            <NotificationDetailsView notification={notification} />
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm" className="font-vazir bg-white">
                          <Edit3 className="w-3 h-3 ml-1" />
                          ویرایش
                        </Button>
                        
                        <Button variant="outline" size="sm" className="font-vazir text-red-600 hover:text-red-700 bg-white">
                          <Trash2 className="w-3 h-3 ml-1" />
                          حذف
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

function AddNotificationForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    recipientType: "parent",
    recipientId: "",
    type: "general",
    priority: "normal",
    title: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Notification form submitted:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نوع گیرنده</Label>
            <Select value={formData.recipientType} onValueChange={(value) => setFormData({...formData, recipientType: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="parent">والدین</SelectItem>
                <SelectItem value="student">دانش‌آموز</SelectItem>
                <SelectItem value="teacher">معلم</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">گیرنده</Label>
            <Select value={formData.recipientId} onValueChange={(value) => setFormData({...formData, recipientId: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="انتخاب گیرنده" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="parent-001">احمد محمدی (والد)</SelectItem>
                <SelectItem value="parent-002">فاطمه کریمی (والد)</SelectItem>
                <SelectItem value="student-001">علی محمدی</SelectItem>
                <SelectItem value="teacher-001">خانم احمدی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نوع پیام</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="disciplinary">انضباطی</SelectItem>
                <SelectItem value="academic">تحصیلی</SelectItem>
                <SelectItem value="achievement">دستاورد</SelectItem>
                <SelectItem value="tuition">شهریه</SelectItem>
                <SelectItem value="general">عمومی</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">اولویت</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="normal">عادی</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
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
            className="font-vazir bg-white"
            placeholder="عنوان پیام"
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">متن پیام</Label>
          <Textarea
            value={formData.message}
            onChange={(e) => setFormData({...formData, message: e.target.value})}
            className="font-vazir min-h-24 bg-white"
            placeholder="متن کامل پیام..."
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            ارسال پیام
          </Button>
        </div>
      </form>
    </div>
  );
}

function NotificationDetailsView({ notification }: { notification: Notification }) {
  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">گیرنده</Label>
              <p className="font-vazir font-medium">{notification.recipientName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">فرستنده</Label>
              <p className="font-vazir font-medium">{notification.senderName}</p>
            </div>
          </div>

          {notification.sentAt && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="font-shabnam text-sm text-muted-foreground">تاریخ ارسال</Label>
                <p className="font-vazir font-medium">{new Date(notification.sentAt).toLocaleDateString('fa-IR')}</p>
              </div>
              {notification.readAt && (
                <div>
                  <Label className="font-shabnam text-sm text-muted-foreground">تاریخ مطالعه</Label>
                  <p className="font-vazir font-medium text-green-600">{new Date(notification.readAt).toLocaleDateString('fa-IR')}</p>
                </div>
              )}
            </div>
          )}

          <Separator />

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">عنوان</Label>
            <p className="font-vazir font-medium">{notification.title}</p>
          </div>

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">متن پیام</Label>
            <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg">{notification.message}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={`${getTypeBadge(notification.type)}`}>
              {notification.type === 'disciplinary' && 'انضباطی'}
              {notification.type === 'academic' && 'تحصیلی'}
              {notification.type === 'achievement' && 'دستاورد'}
              {notification.type === 'tuition' && 'شهریه'}
              {notification.type === 'general' && 'عمومی'}
            </Badge>
            <Badge className={`${getPriorityBadge(notification.priority)}`}>
              {notification.priority === 'low' && 'کم'}
              {notification.priority === 'normal' && 'عادی'}
              {notification.priority === 'high' && 'بالا'}
              {notification.priority === 'urgent' && 'فوری'}
            </Badge>
            {notification.isRead && (
              <Badge className="bg-green-100 text-green-800">خوانده شده</Badge>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

function getTypeBadge(type: string) {
  const variants = {
    disciplinary: "bg-red-100 text-red-800",
    academic: "bg-blue-100 text-blue-800",
    general: "bg-gray-100 text-gray-800",
    tuition: "bg-orange-100 text-orange-800",
    achievement: "bg-green-100 text-green-800"
  };
  return variants[type as keyof typeof variants] || variants.general;
}

function getPriorityBadge(priority: string) {
  const variants = {
    low: "bg-gray-100 text-gray-800",
    normal: "bg-blue-100 text-blue-800", 
    high: "bg-yellow-100 text-yellow-800",
    urgent: "bg-red-100 text-red-800"
  };
  return variants[priority as keyof typeof variants] || variants.normal;
}