import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import LoadingSpinner from "@/components/common/loading-spinner";
import { Link } from "wouter";
import { 
  Calendar, 
  Clock, 
  BookOpen, 
  User,
  MapPin,
  Bell,
  AlertTriangle,
  Home,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface WeeklyClass {
  id: string;
  day: string;
  time: string;
  subject: string;
  teacher: string;
  room: string;
  type: 'class' | 'exam' | 'activity' | 'break';
  hasDeadline?: boolean;
  upcomingDeadline?: string;
}

interface WeekSchedule {
  weekStart: string;
  weekEnd: string;
  classes: WeeklyClass[];
}

const mockWeeklySchedule: WeekSchedule = {
  weekStart: "2024-01-15",
  weekEnd: "2024-01-19",
  classes: [
    // شنبه
    { id: "1", day: "شنبه", time: "08:00", subject: "ریاضی", teacher: "خانم احمدی", room: "کلاس 201", type: "class", hasDeadline: true, upcomingDeadline: "فردا" },
    { id: "2", day: "شنبه", time: "08:55", subject: "فیزیک", teacher: "آقای رضایی", room: "آزمایشگاه", type: "class" },
    { id: "3", day: "شنبه", time: "09:50", subject: "تفریح", teacher: "-", room: "حیاط", type: "break" },
    { id: "4", day: "شنبه", time: "10:05", subject: "شیمی", teacher: "دکتر حسینی", room: "آزمایشگاه شیمی", type: "class" },
    { id: "5", day: "شنبه", time: "11:00", subject: "ادبیات", teacher: "خانم صادقی", room: "کلاس 203", type: "class" },
    { id: "6", day: "شنبه", time: "11:55", subject: "ورزش", teacher: "آقای کریمی", room: "سالن ورزش", type: "activity" },

    // یکشنبه
    { id: "7", day: "یکشنبه", time: "08:00", subject: "انگلیسی", teacher: "خانم رحیمی", room: "کلاس 204", type: "class" },
    { id: "8", day: "یکشنبه", time: "08:55", subject: "ریاضی", teacher: "خانم احمدی", room: "کلاس 201", type: "class" },
    { id: "9", day: "یکشنبه", time: "09:50", subject: "تفریح", teacher: "-", room: "حیاط", type: "break" },
    { id: "10", day: "یکشنبه", time: "10:05", subject: "تاریخ", teacher: "آقای موسوی", room: "کلاس 205", type: "class" },
    { id: "11", day: "یکشنبه", time: "11:00", subject: "جغرافیا", teacher: "خانم کریمی", room: "کلاس 206", type: "class" },

    // دوشنبه
    { id: "12", day: "دوشنبه", time: "08:00", subject: "فیزیک", teacher: "آقای رضایی", room: "آزمایشگاه", type: "class", hasDeadline: true, upcomingDeadline: "امروز" },
    { id: "13", day: "دوشنبه", time: "08:55", subject: "شیمی", teacher: "دکتر حسینی", room: "آزمایشگاه شیمی", type: "class" },
    { id: "14", day: "دوشنبه", time: "09:50", subject: "تفریح", teacher: "-", room: "حیاط", type: "break" },
    { id: "15", day: "دوشنبه", time: "10:05", subject: "ادبیات", teacher: "خانم صادقی", room: "کلاس 203", type: "class" },
    { id: "16", day: "دوشنبه", time: "11:00", subject: "آزمون ریاضی", teacher: "خانم احمدی", room: "کلاس 201", type: "exam" },

    // سه‌شنبه
    { id: "17", day: "سه‌شنبه", time: "08:00", subject: "زیست‌شناسی", teacher: "دکتر احمدی", room: "آزمایشگاه زیست", type: "class" },
    { id: "18", day: "سه‌شنبه", time: "08:55", subject: "انگلیسی", teacher: "خانم رحیمی", room: "کلاس 204", type: "class" },
    { id: "19", day: "سه‌شنبه", time: "09:50", subject: "تفریح", teacher: "-", room: "حیاط", type: "break" },
    { id: "20", day: "سه‌شنبه", time: "10:05", subject: "ریاضی", teacher: "خانم احمدی", room: "کلاس 201", type: "class" },
    { id: "21", day: "سه‌شنبه", time: "11:00", subject: "تربیت بدنی", teacher: "آقای کریمی", room: "سالن ورزش", type: "activity" },

    // چهارشنبه
    { id: "22", day: "چهارشنبه", time: "08:00", subject: "دینی", teacher: "حجت‌الاسلام نجفی", room: "کلاس 207", type: "class" },
    { id: "23", day: "چهارشنبه", time: "08:55", subject: "فیزیک", teacher: "آقای رضایی", room: "آزمایشگاه", type: "class" },
    { id: "24", day: "چهارشنبه", time: "09:50", subject: "تفریح", teacher: "-", room: "حیاط", type: "break" },
    { id: "25", day: "چهارشنبه", time: "10:05", subject: "شیمی", teacher: "دکتر حسینی", room: "آزمایشگاه شیمی", type: "class" },
    { id: "26", day: "چهارشنبه", time: "11:00", subject: "ادبیات", teacher: "خانم صادقی", room: "کلاس 203", type: "class" }
  ]
};

export default function WeeklySchedule() {
  const { user } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState("current");

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  const days = ["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه"];
  const timeSlots = ["08:00", "08:55", "09:50", "10:05", "11:00", "11:55"];

  const getClassForDayAndTime = (day: string, time: string) => {
    return mockWeeklySchedule.classes.find(c => c.day === day && c.time === time);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'class': return <BookOpen className="w-3 h-3 text-blue-500" />;
      case 'exam': return <AlertTriangle className="w-3 h-3 text-red-500" />;
      case 'break': return <Clock className="w-3 h-3 text-green-500" />;
      case 'activity': return <User className="w-3 h-3 text-purple-500" />;
      default: return <BookOpen className="w-3 h-3 text-gray-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'class': return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'exam': return 'bg-red-50 border-red-200 text-red-800';
      case 'break': return 'bg-green-50 border-green-200 text-green-800';
      case 'activity': return 'bg-purple-50 border-purple-200 text-purple-800';
      default: return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const upcomingDeadlines = mockWeeklySchedule.classes.filter(c => c.hasDeadline);

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
                برنامه هفتگی
              </h1>
              <p className="text-sm md:text-base text-muted-foreground font-vazir">
                جدول کلاسی هفتگی و برنامه‌ریزی درسی - دبیرستان شهید چمران
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="font-vazir bg-white">
                <ChevronRight className="w-4 h-4" />
                هفته قبل
              </Button>
              <Button variant="outline" className="font-vazir bg-white">
                <RefreshCw className="w-4 h-4 ml-1" />
                به‌روزرسانی
              </Button>
              <Button variant="outline" className="font-vazir bg-white">
                هفته بعد
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Week Navigation */}
          <Card className="mb-6 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-shabnam font-semibold text-lg">
                    هفته {new Date(mockWeeklySchedule.weekStart).toLocaleDateString('fa-IR')} تا {new Date(mockWeeklySchedule.weekEnd).toLocaleDateString('fa-IR')}
                  </h3>
                  <p className="text-sm text-muted-foreground font-vazir">ترم دوم - سال تحصیلی 1403-1402</p>
                </div>
                <Badge className="bg-blue-100 text-blue-800">هفته جاری</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Deadline Warnings */}
          {upcomingDeadlines.length > 0 && (
            <Card className="mb-6 border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="font-shabnam text-orange-800 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  هشدار ددلاین تکالیف
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {upcomingDeadlines.map((classItem) => (
                    <div key={classItem.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        <div>
                          <p className="font-shabnam font-semibold text-orange-800">{classItem.subject}</p>
                          <p className="text-sm font-vazir text-orange-600">معلم: {classItem.teacher}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <Badge className={`${classItem.upcomingDeadline === 'امروز' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                          ددلاین {classItem.upcomingDeadline}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Schedule Table */}
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="font-shabnam">جدول کلاسی هفتگی</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="p-3 text-right font-shabnam font-semibold bg-gray-50">ساعت</th>
                      {days.map(day => (
                        <th key={day} className="p-3 text-center font-shabnam font-semibold bg-gray-50 min-w-32">
                          {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {timeSlots.map(time => (
                      <tr key={time} className="border-b hover:bg-gray-50/50">
                        <td className="p-3 font-dana font-bold text-sm bg-gray-50/50 border-l">
                          {time}
                        </td>
                        {days.map(day => {
                          const classItem = getClassForDayAndTime(day, time);
                          return (
                            <td key={`${day}-${time}`} className="p-2">
                              {classItem ? (
                                <div className={`p-2 rounded-lg border text-xs relative ${getTypeColor(classItem.type)}`}>
                                  {classItem.hasDeadline && (
                                    <div className="absolute -top-1 -right-1">
                                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1 mb-1">
                                    {getTypeIcon(classItem.type)}
                                    <span className="font-shabnam font-semibold truncate">
                                      {classItem.subject}
                                    </span>
                                  </div>
                                  {classItem.teacher !== '-' && (
                                    <div className="flex items-center gap-1 mb-1">
                                      <User className="w-2 h-2" />
                                      <span className="font-vazir truncate text-xs">
                                        {classItem.teacher}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-2 h-2" />
                                    <span className="font-vazir truncate text-xs">
                                      {classItem.room}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <div className="h-16 bg-gray-100/30 rounded-lg border border-dashed border-gray-300"></div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="mt-6 bg-white">
            <CardContent className="p-4">
              <h3 className="font-shabnam font-semibold mb-3">راهنمای رنگ‌ها:</h3>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-200 rounded"></div>
                  <span className="font-vazir text-sm">کلاس عادی</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-200 rounded"></div>
                  <span className="font-vazir text-sm">آزمون</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-200 rounded"></div>
                  <span className="font-vazir text-sm">تفریح</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-200 rounded"></div>
                  <span className="font-vazir text-sm">فعالیت</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-vazir text-sm">نزدیک به ددلاین</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}