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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Link } from "wouter";
import { 
  MessageSquare, 
  Plus, 
  Search, 
  Filter, 
  Send,
  User,
  Eye,
  Reply,
  Clock,
  CheckCircle,
  Circle,
  Star,
  Archive,
  Trash2,
  Home,
  Users,
  BookOpen
} from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'student' | 'teacher' | 'parent' | 'counselor' | 'vice_principal';
  receiverId: string;
  receiverName: string;
  receiverRole: 'student' | 'teacher' | 'parent' | 'counselor' | 'vice_principal';
  subject: string;
  content: string;
  sentAt: string;
  readAt?: string;
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  category: 'academic' | 'behavioral' | 'administrative' | 'personal' | 'general';
  isStarred: boolean;
  isArchived: boolean;
  parentMessageId?: string;
  attachments?: string[];
}

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "student-001",
    senderName: "علی محمدی",
    senderRole: "student",
    receiverId: "teacher-001",
    receiverName: "خانم احمدی",
    receiverRole: "teacher",
    subject: "سؤال در مورد تمرین ریاضی",
    content: "سلام خانم احمدی. در مورد تمرین صفحه 45 سؤالی دارم. آیا می‌توانم در ساعت اداری با شما صحبت کنم؟",
    sentAt: "2024-01-15T10:30:00",
    isRead: false,
    priority: "normal",
    category: "academic",
    isStarred: false,
    isArchived: false
  },
  {
    id: "2",
    senderId: "teacher-002", 
    senderName: "آقای رضایی",
    senderRole: "teacher",
    receiverId: "student-001",
    receiverName: "علی محمدی",
    receiverRole: "student",
    subject: "بازخورد آزمون فیزیک",
    content: "سلام علی. نتیجه آزمون فیزیک شما بسیار خوب بوده است. ادامه دهید و در صورت نیاز به کمک، با من در ارتباط باشید.",
    sentAt: "2024-01-14T14:20:00",
    readAt: "2024-01-14T15:45:00",
    isRead: true,
    priority: "normal",
    category: "academic",
    isStarred: true,
    isArchived: false
  },
  {
    id: "3",
    senderId: "student-001",
    senderName: "علی محمدی", 
    senderRole: "student",
    receiverId: "counselor-001",
    receiverName: "آقای صادقی",
    receiverRole: "counselor",
    subject: "درخواست جلسه مشاوره",
    content: "سلام آقای صادقی. می‌خواهم برای صحبت در مورد انتخاب رشته دانشگاهی با شما وقت بگیرم. کی امکان ملاقات هست؟",
    sentAt: "2024-01-13T16:00:00",
    isRead: false,
    priority: "high",
    category: "personal",
    isStarred: false,
    isArchived: false
  },
  {
    id: "4",
    senderId: "vice_principal-001",
    senderName: "خانم موسوی",
    senderRole: "vice_principal",
    receiverId: "student-001", 
    receiverName: "علی محمدی",
    receiverRole: "student",
    subject: "تقدیر از عملکرد خوب",
    content: "تبریک! عملکرد شما در این ترم بسیار قابل تقدیر بوده است. امیدواریم همچنان این روند را ادامه دهید.",
    sentAt: "2024-01-12T09:15:00",
    readAt: "2024-01-12T10:30:00",
    isRead: true,
    priority: "normal",
    category: "general",
    isStarred: true,
    isArchived: false
  }
];

export default function TeacherMessaging() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [isComposeDialogOpen, setIsComposeDialogOpen] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const getFilteredMessages = () => {
    let filtered = mockMessages;

    // Filter by tab
    if (selectedTab === "starred") {
      filtered = filtered.filter(msg => msg.isStarred);
    } else if (selectedTab === "sent") {
      filtered = filtered.filter(msg => msg.senderId === user.id);
    } else if (selectedTab === "archived") {
      filtered = filtered.filter(msg => msg.isArchived);
    } else {
      // inbox - messages received by current user
      filtered = filtered.filter(msg => msg.receiverId === user.id);
    }

    // Apply other filters
    const matchesSearch = filtered.filter(msg => 
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = matchesSearch.filter(msg => 
      filterStatus === "all" || 
      (filterStatus === "read" && msg.isRead) ||
      (filterStatus === "unread" && !msg.isRead)
    );

    const matchesCategory = matchesStatus.filter(msg =>
      filterCategory === "all" || msg.category === filterCategory
    );

    return matchesCategory;
  };

  const filteredMessages = getFilteredMessages();

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800",
      normal: "bg-blue-100 text-blue-800", 
      high: "bg-yellow-100 text-yellow-800",
      urgent: "bg-red-100 text-red-800"
    };
    return variants[priority as keyof typeof variants] || variants.normal;
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'academic': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'behavioral': return <Users className="w-4 h-4 text-orange-500" />;
      case 'administrative': return <Circle className="w-4 h-4 text-purple-500" />;
      case 'personal': return <User className="w-4 h-4 text-green-500" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-500" />;
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
              <div className="flex items-center gap-2 mb-2">
                <Link href="/">
                  <Button variant="outline" size="sm" className="font-vazir bg-white">
                    <Home className="w-4 h-4 ml-1" />
                    بازگشت به داشبورد
                  </Button>
                </Link>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold font-shabnam text-gradient mb-2">
                پیام به معلمان
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                ارتباط با معلمان و کادر آموزشی - دبیرستان شهید چمران
              </p>
            </div>
            <Dialog open={isComposeDialogOpen} onOpenChange={setIsComposeDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary text-white hover:opacity-90 font-shabnam">
                  <Plus className="w-4 h-4 ml-2" />
                  پیام جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto bg-white">
                <DialogHeader>
                  <DialogTitle className="font-shabnam text-right">نوشتن پیام جدید</DialogTitle>
                </DialogHeader>
                <ComposeMessageForm onClose={() => setIsComposeDialogOpen(false)} />
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
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">24</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-yellow-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">خوانده نشده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-yellow-600">6</p>
                  </div>
                  <Circle className="w-8 h-8 text-yellow-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">پاسخ داده شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">18</p>
                  </div>
                  <Reply className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">ستاره‌دار</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">4</p>
                  </div>
                  <Star className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Message Tabs */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                  variant={selectedTab === "inbox" ? "default" : "outline"}
                  onClick={() => setSelectedTab("inbox")}
                  className="font-vazir bg-white"
                >
                  صندوق ورودی
                </Button>
                <Button 
                  variant={selectedTab === "sent" ? "default" : "outline"}
                  onClick={() => setSelectedTab("sent")}
                  className="font-vazir bg-white"
                >
                  ارسال شده
                </Button>
                <Button 
                  variant={selectedTab === "starred" ? "default" : "outline"}
                  onClick={() => setSelectedTab("starred")}
                  className="font-vazir bg-white"
                >
                  ستاره‌دار
                </Button>
                <Button 
                  variant={selectedTab === "archived" ? "default" : "outline"}
                  onClick={() => setSelectedTab("archived")}
                  className="font-vazir bg-white"
                >
                  بایگانی
                </Button>
              </div>

              {/* Filters and Search */}
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
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه پیام‌ها</SelectItem>
                      <SelectItem value="read">خوانده شده</SelectItem>
                      <SelectItem value="unread">خوانده نشده</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full sm:w-40 font-vazir bg-white">
                      <SelectValue placeholder="دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="all">همه دسته‌ها</SelectItem>
                      <SelectItem value="academic">آموزشی</SelectItem>
                      <SelectItem value="behavioral">انضباطی</SelectItem>
                      <SelectItem value="administrative">اداری</SelectItem>
                      <SelectItem value="personal">شخصی</SelectItem>
                      <SelectItem value="general">عمومی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Messages List */}
          <div className="grid gap-4">
            {filteredMessages.length === 0 ? (
              <Card className="bg-white">
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-vazir">هیچ پیامی یافت نشد</p>
                </CardContent>
              </Card>
            ) : (
              filteredMessages.map((message) => (
                <Card key={message.id} className={`hover:shadow-md transition-shadow bg-white ${!message.isRead && selectedTab === 'inbox' ? 'border-l-4 border-l-blue-500' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder-user.jpg" />
                        <AvatarFallback className="bg-primary/10 text-primary font-shabnam">
                          {message.senderName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          {getCategoryIcon(message.category)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {message.subject}
                          </h3>
                          {!message.isRead && selectedTab === 'inbox' && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">جدید</Badge>
                          )}
                          <Badge className={`text-xs ${getPriorityBadge(message.priority)}`}>
                            {message.priority === 'low' && 'کم'}
                            {message.priority === 'normal' && 'عادی'}
                            {message.priority === 'high' && 'بالا'}
                            {message.priority === 'urgent' && 'فوری'}
                          </Badge>
                          {message.isStarred && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                        </div>

                        <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground font-vazir">
                          <span>از: {message.senderName}</span>
                          <span>•</span>
                          <span>به: {message.receiverName}</span>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 font-vazir line-clamp-2">
                          {message.content}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-vazir">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(message.sentAt).toLocaleDateString('fa-IR')}</span>
                            {message.readAt && (
                              <>
                                <span className="mx-1">•</span>
                                <CheckCircle className="w-3 h-3 text-green-500" />
                                <span>خوانده شده</span>
                              </>
                            )}
                          </div>
                          
                          <div className="flex gap-1">
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
                                <MessageDetailsView message={message} />
                              </DialogContent>
                            </Dialog>
                            
                            <Button variant="outline" size="sm" className="font-vazir bg-white">
                              <Reply className="w-3 h-3 ml-1" />
                              پاسخ
                            </Button>
                          </div>
                        </div>
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

function ComposeMessageForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({
    receiverId: "",
    receiverRole: "teacher",
    subject: "",
    content: "",
    priority: "normal",
    category: "academic"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Message composed:", formData);
    onClose();
  };

  return (
    <div className="bg-white">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="font-shabnam">نوع گیرنده</Label>
            <Select value={formData.receiverRole} onValueChange={(value) => setFormData({...formData, receiverRole: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="teacher">معلم</SelectItem>
                <SelectItem value="counselor">مشاور</SelectItem>
                <SelectItem value="vice_principal">معاون</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="font-shabnam">گیرنده</Label>
            <Select value={formData.receiverId} onValueChange={(value) => setFormData({...formData, receiverId: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="انتخاب گیرنده" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="teacher-001">خانم احمدی (ریاضی)</SelectItem>
                <SelectItem value="teacher-002">آقای رضایی (فیزیک)</SelectItem>
                <SelectItem value="counselor-001">آقای صادقی (مشاور)</SelectItem>
                <SelectItem value="vice_principal-001">خانم موسوی (معاون)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="space-y-2">
            <Label className="font-shabnam">دسته‌بندی</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="academic">آموزشی</SelectItem>
                <SelectItem value="behavioral">انضباطی</SelectItem>
                <SelectItem value="administrative">اداری</SelectItem>
                <SelectItem value="personal">شخصی</SelectItem>
                <SelectItem value="general">عمومی</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">موضوع</Label>
          <Input
            value={formData.subject}
            onChange={(e) => setFormData({...formData, subject: e.target.value})}
            className="font-vazir bg-white"
            placeholder="موضوع پیام"
            required
          />
        </div>

        <div className="space-y-2">
          <Label className="font-shabnam">متن پیام</Label>
          <Textarea
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            className="font-vazir min-h-32 bg-white"
            placeholder="متن کامل پیام خود را بنویسید..."
            required
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="font-vazir bg-white">
            انصراف
          </Button>
          <Button type="submit" className="gradient-primary text-white font-vazir">
            <Send className="w-4 h-4 ml-1" />
            ارسال پیام
          </Button>
        </div>
      </form>
    </div>
  );
}

function MessageDetailsView({ message }: { message: Message }) {
  return (
    <div className="bg-white">
      <ScrollArea className="max-h-96">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">فرستنده</Label>
              <p className="font-vazir font-medium">{message.senderName}</p>
            </div>
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">گیرنده</Label>
              <p className="font-vazir font-medium">{message.receiverName}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="font-shabnam text-sm text-muted-foreground">تاریخ ارسال</Label>
              <p className="font-vazir font-medium">{new Date(message.sentAt).toLocaleDateString('fa-IR')}</p>
            </div>
            {message.readAt && (
              <div>
                <Label className="font-shabnam text-sm text-muted-foreground">تاریخ مطالعه</Label>
                <p className="font-vazir font-medium text-green-600">{new Date(message.readAt).toLocaleDateString('fa-IR')}</p>
              </div>
            )}
          </div>

          <Separator />

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">موضوع</Label>
            <p className="font-vazir font-medium">{message.subject}</p>
          </div>

          <div>
            <Label className="font-shabnam text-sm text-muted-foreground">متن پیام</Label>
            <p className="font-vazir text-sm mt-2 p-3 bg-gray-50 rounded-lg leading-relaxed">{message.content}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={`${getPriorityBadge(message.priority)}`}>
              {message.priority === 'low' && 'اولویت کم'}
              {message.priority === 'normal' && 'اولویت عادی'}
              {message.priority === 'high' && 'اولویت بالا'}
              {message.priority === 'urgent' && 'فوری'}
            </Badge>
            <Badge variant="outline">
              {message.category === 'academic' && 'آموزشی'}
              {message.category === 'behavioral' && 'انضباطی'}
              {message.category === 'administrative' && 'اداری'}
              {message.category === 'personal' && 'شخصی'}
              {message.category === 'general' && 'عمومی'}
            </Badge>
            {message.isStarred && (
              <Badge className="bg-yellow-100 text-yellow-800">ستاره‌دار</Badge>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button className="font-vazir">
              <Reply className="w-4 h-4 ml-1" />
              پاسخ دادن
            </Button>
            <Button variant="outline" className="font-vazir bg-white">
              <Star className="w-4 h-4 ml-1" />
              ستاره‌دار کردن
            </Button>
            <Button variant="outline" className="font-vazir bg-white">
              <Archive className="w-4 h-4 ml-1" />
              بایگانی
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
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