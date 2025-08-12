import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  Users, 
  MapPin,
  Bell,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  School,
  User,
  Eye,
  RefreshCw,
  Play,
  Pause,
  Square
} from "lucide-react";

interface ScheduleItem {
  id: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'exam' | 'break' | 'activity';
  status: 'upcoming' | 'current' | 'completed';
  duration: number; // minutes
  disciplinaryIssues?: DisciplinaryIssue[];
}

interface DisciplinaryIssue {
  id: string;
  type: string;
  description: string;
  compensationSuggestion: string;
  suggestedBy: string;
  suggestedByRole: string;
  severity: 'minor' | 'moderate' | 'major';
  dueDate?: string;
}

const mockSchedule: ScheduleItem[] = [
  {
    id: "1",
    time: "08:00",
    subject: "ریاضی",
    teacher: "خانم احمدی",
    room: "کلاس 201",
    type: "class",
    status: "completed",
    duration: 45,
    disciplinaryIssues: [
      {
        id: "disc-1",
        type: "تأخیر در حضور",
        description: "سه بار در هفته گذشته با تأخیر وارد کلاس شده‌اید",
        compensationSuggestion: "برای جبران این موضوع، پیشنهاد می‌شود که برنامه زمانی روزانه خود را بازنگری کرده و ساعت خواب را زودتر تنظیم نمایید. همچنین می‌توانید با تنظیم چندین زنگ هشدار، از به موقع بیدار شدن اطمینان حاصل کنید.",
        suggestedBy: "خانم احمدی",
        suggestedByRole: "معلم ریاضی",
        severity: "minor",
        dueDate: "2024-01-22"
      }
    ]
  },
  {
    id: "2",
    time: "08:55",
    subject: "فیزیک",
    teacher: "آقای رضایی",
    room: "آزمایشگاه علوم",
    type: "class",
    status: "completed",
    duration: 45
  },
  {
    id: "3",
    time: "09:50",
    subject: "تفریح",
    teacher: "-",
    room: "حیاط مدرسه",
    type: "break",
    status: "completed",
    duration: 15
  },
  {
    id: "4",
    time: "10:05",
    subject: "ادبیات فارسی",
    teacher: "خانم صادقی",
    room: "کلاس 203",
    type: "class",
    status: "current",
    duration: 45,
    disciplinaryIssues: [
      {
        id: "disc-2",
        type: "عدم انجام تکلیف",
        description: "تکلیف انشا در موعد مقرر تحویل داده نشده است",
        compensationSuggestion: "برای جبران این تکلیف، می‌توانید انشای خود را تا پایان هفته تحویل دهید. همچنین پیشنهاد می‌شود که یک برنامه مطالعاتی منظم تنظیم کرده و برای هر درس زمان مشخصی اختصاص دهید.",
        suggestedBy: "خانم موسوی",
        suggestedByRole: "معاون آموزشی",
        severity: "moderate"
      }
    ]
  },
  {
    id: "5",
    time: "11:00",
    subject: "شیمی",
    teacher: "دکتر حسینی",
    room: "آزمایشگاه شیمی",
    type: "class",
    status: "upcoming",
    duration: 45
  },
  {
    id: "6",
    time: "11:55",
    subject: "ورزش",
    teacher: "آقای کریمی",
    room: "سالن ورزش",
    type: "activity",
    status: "upcoming",
    duration: 45
  }
];

export default function DailySchedule() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [showDisciplinaryIssues, setShowDisciplinaryIssues] = useState(true);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'current': return <Play className="w-4 h-4 text-blue-500" />;
      case 'upcoming': return <Clock className="w-4 h-4 text-gray-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'class': return <BookOpen className="w-4 h-4 text-blue-500" />;
      case 'exam': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'break': return <Pause className="w-4 h-4 text-green-500" />;
      case 'activity': return <Users className="w-4 h-4 text-purple-500" />;
      default: return <BookOpen className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const variants = {
      minor: "bg-yellow-100 text-yellow-800",
      moderate: "bg-orange-100 text-orange-800",
      major: "bg-red-100 text-red-800"
    };
    return variants[severity as keyof typeof variants] || variants.minor;
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
                برنامه روزانه - hPlan
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                برنامه کلاسی و موارد انضباطی - دبیرستان شهید چمران
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.open('https://hplan.ir', '_blank')}
                className="font-vazir bg-white"
              >
                <ExternalLink className="w-4 h-4 ml-1" />
                ورود به hPlan
              </Button>
              <Button variant="outline" className="font-vazir bg-white">
                <RefreshCw className="w-4 h-4 ml-1" />
                به‌روزرسانی
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="glass border-primary/20 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">کلاس‌های امروز</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-primary">6</p>
                  </div>
                  <BookOpen className="w-8 h-8 text-primary opacity-75" />
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass border-green-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">تکمیل شده</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-green-600">3</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-blue-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">در حال برگزاری</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-blue-600">1</p>
                  </div>
                  <Play className="w-8 h-8 text-blue-600 opacity-75" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-orange-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-vazir text-muted-foreground">موارد انضباطی</p>
                    <p className="text-xl md:text-2xl font-bold font-shabnam text-orange-600">2</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-orange-600 opacity-75" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Schedule Timeline */}
          <Card className="mb-6 bg-white">
            <CardHeader>
              <CardTitle className="font-shabnam flex items-center justify-between">
                <span>برنامه کلاسی</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {new Date(selectedDate).toLocaleDateString('fa-IR')}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSchedule.map((item, index) => (
                  <div key={item.id} className="relative">
                    {index < mockSchedule.length - 1 && (
                      <div className="absolute right-4 top-12 bottom-0 w-px bg-border"></div>
                    )}
                    
                    <div className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                      item.status === 'current' 
                        ? 'bg-blue-50 border-2 border-blue-200' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}>
                      <div className="flex-shrink-0 flex flex-col items-center">
                        {getStatusIcon(item.status)}
                        <span className={`text-sm font-bold font-dana mt-1 ${
                          item.status === 'current' ? 'text-blue-600' : 'text-muted-foreground'
                        }`}>
                          {item.time}
                        </span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold font-shabnam text-sm md:text-base">
                            {item.subject}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {item.duration} دقیقه
                          </Badge>
                          {item.status === 'current' && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">در حال برگزاری</Badge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground font-vazir mb-2">
                          {item.teacher !== '-' && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{item.teacher}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.room}</span>
                          </div>
                        </div>

                        {/* Disciplinary Issues */}
                        {item.disciplinaryIssues && item.disciplinaryIssues.length > 0 && showDisciplinaryIssues && (
                          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500" />
                              <span className="font-semibold font-shabnam text-orange-800 text-sm">
                                موارد انضباطی قابل جبران
                              </span>
                            </div>
                            
                            {item.disciplinaryIssues.map((issue) => (
                              <div key={issue.id} className="mb-3 last:mb-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge className={`text-xs ${getSeverityBadge(issue.severity)}`}>
                                    {issue.type}
                                  </Badge>
                                  <span className="text-xs text-muted-foreground font-vazir">
                                    پیشنهاد {issue.suggestedByRole}: {issue.suggestedBy}
                                  </span>
                                </div>
                                
                                <p className="text-sm text-orange-700 font-vazir mb-2">
                                  {issue.description}
                                </p>
                                
                                <div className="bg-white p-2 rounded border border-orange-200">
                                  <p className="text-xs text-gray-600 mb-1 font-shabnam font-semibold">
                                    💡 پیشنهاد برای جبران:
                                  </p>
                                  <p className="text-sm text-gray-700 font-vazir leading-relaxed">
                                    {issue.compensationSuggestion}
                                  </p>
                                  {issue.dueDate && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-vazir">
                                      <Calendar className="w-3 h-3" />
                                      <span>مهلت انجام: {new Date(issue.dueDate).toLocaleDateString('fa-IR')}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-shabnam text-base flex items-center gap-2">
                  <ExternalLink className="w-4 h-4" />
                  دسترسی سریع
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start font-vazir bg-white"
                  onClick={() => window.open('https://hplan.ir/login', '_blank')}
                >
                  <ExternalLink className="w-4 h-4 ml-2" />
                  ورود به پورتال hPlan
                </Button>
                <Button variant="outline" className="w-full justify-start font-vazir bg-white">
                  <Calendar className="w-4 h-4 ml-2" />
                  مشاهده تقویم کامل
                </Button>
                <Button variant="outline" className="w-full justify-start font-vazir bg-white">
                  <Bell className="w-4 h-4 ml-2" />
                  تنظیمات یادآوری
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader>
                <CardTitle className="font-shabnam text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  خلاصه موارد انضباطی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-vazir">
                  <div className="flex justify-between">
                    <span>موارد جزئی:</span>
                    <Badge className="bg-yellow-100 text-yellow-800">1</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>موارد متوسط:</span>
                    <Badge className="bg-orange-100 text-orange-800">1</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>موارد مهم:</span>
                    <Badge className="bg-red-100 text-red-800">0</Badge>
                  </div>
                  <Separator className="my-2" />
                  <p className="text-xs text-muted-foreground">
                    برای مشاهده جزئیات و پیشنهادات جبران، روی هر مورد کلیک کنید.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}