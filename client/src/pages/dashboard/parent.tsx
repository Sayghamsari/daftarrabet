import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Calendar, 
  Users, 
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock,
  FileText,
  User,
  Settings,
  BarChart3,
  BookOpen,
  GraduationCap,
  AlertCircle,
  Award,
  Bell,
  Phone,
  Mail
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function ParentDashboard() {
  // Mock data - replace with real API calls
  const children = [
    { 
      id: 1, 
      name: "علی احمدی", 
      grade: "دهم", 
      class: "الف", 
      average: 17.5, 
      attendance: 95,
      lastUpdate: "۱۴۰۳/۰۸/۱۵"
    }
  ];

  const recentGrades = [
    { subject: "ریاضی", grade: 18, date: "۱۴۰۳/۰۸/۱۵", teacher: "آقای احمدی" },
    { subject: "فیزیک", grade: 17, date: "۱۴۰۳/۰۸/۱۲", teacher: "خانم رضایی" },
    { subject: "فارسی", grade: 19, date: "۱۴۰۳/۰۸/۱۰", teacher: "آقای محمدی" }
  ];

  const upcomingEvents = [
    { id: 1, title: "جلسه اولیا و مربیان", date: "۱۴۰۳/۰۸/۲۰", time: "۱۶:۰۰", type: "meeting" },
    { id: 2, title: "آزمون میان‌ترم ریاضی", date: "۱۴۰۳/۰۸/۲۵", time: "۰۸:۰۰", type: "exam" },
    { id: 3, title: "مهلت ثبت‌نام انتخاب رشته", date: "۱۴۰۳/۰۹/۰۱", time: "-", type: "deadline" }
  ];

  const messages = [
    { id: 1, from: "آقای احمدی (معلم ریاضی)", subject: "پیشرفت تحصیلی", time: "۲ ساعت پیش", unread: true },
    { id: 2, from: "دفتر رابط", subject: "اطلاعیه جلسه اولیا", time: "۱ روز پیش", unread: false },
    { id: 3, from: "مشاور مدرسه", subject: "گزارش روانشناختی", time: "۳ روز پیش", unread: false }
  ];

  const attendanceData = [
    { month: "مهر", present: 20, absent: 2, late: 1 },
    { month: "آبان", present: 22, absent: 1, late: 0 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-shabnam font-bold text-gray-900 mb-2">پنل اولیا</h1>
          <p className="font-dana text-gray-600">خوش آمدید! از اینجا می‌توانید وضعیت تحصیلی فرزندتان را پیگیری کنید.</p>
        </div>

        {/* Child Overview */}
        <div className="mb-8">
          <h2 className="text-xl font-shabnam font-bold mb-4">اطلاعات فرزند</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-sahel font-medium text-blue-800">میانگین کل</CardTitle>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-900">{children[0].average}</div>
                <p className="text-xs text-blue-600 font-dana">از ۲۰</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-sahel font-medium text-green-800">درصد حضور</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-900">{children[0].attendance}٪</div>
                <p className="text-xs text-green-600 font-dana">در این ماه</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-sahel font-medium text-purple-800">پیام‌های جدید</CardTitle>
                <MessageSquare className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-900">{messages.filter(m => m.unread).length}</div>
                <p className="text-xs text-purple-600 font-dana">خوانده نشده</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-sahel font-medium text-orange-800">رویدادهای آینده</CardTitle>
                <Calendar className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-900">{upcomingEvents.length}</div>
                <p className="text-xs text-orange-600 font-dana">برنامه‌ریزی شده</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="font-sahel">کلی</TabsTrigger>
            <TabsTrigger value="grades" className="font-sahel">نمرات</TabsTrigger>
            <TabsTrigger value="attendance" className="font-sahel">حضور و غیاب</TabsTrigger>
            <TabsTrigger value="events" className="font-sahel">رویدادها</TabsTrigger>
            <TabsTrigger value="messages" className="font-sahel">پیام‌ها</TabsTrigger>
            <TabsTrigger value="profile" className="font-sahel">پروفایل</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Child Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                    <User className="w-5 h-5" />
                    اطلاعات فرزند
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-full">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-sahel font-bold text-lg">{children[0].name}</h3>
                      <p className="font-dana text-gray-600">پایه {children[0].grade} - کلاس {children[0].class}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-dana text-sm text-gray-600">میانگین کل</p>
                      <p className="font-bold text-lg text-primary">{children[0].average}</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="font-dana text-sm text-gray-600">حضور</p>
                      <p className="font-bold text-lg text-green-600">{children[0].attendance}٪</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-sahel font-bold text-sm">نمره ریاضی ثبت شد</p>
                        <p className="font-dana text-xs text-gray-600">۲ ساعت پیش</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <MessageSquare className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-sahel font-bold text-sm">پیام از معلم ریاضی</p>
                        <p className="font-dana text-xs text-gray-600">۵ ساعت پیش</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <Bell className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="font-sahel font-bold text-sm">یادآوری جلسه اولیا</p>
                        <p className="font-dana text-xs text-gray-600">۱ روز پیش</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  نمرات اخیر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{grade.subject}</h4>
                          <p className="font-dana text-sm text-gray-600">{grade.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-dana text-lg font-bold text-primary">{grade.grade}</p>
                          <p className="font-dana text-xs text-gray-600">از ۲۰</p>
                        </div>
                        <div className="text-left">
                          <p className="font-dana text-sm text-gray-600">تاریخ</p>
                          <p className="font-dana text-sm font-bold">{grade.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" className="w-full font-sahel">
                    مشاهده تمام نمرات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  گزارش حضور و غیاب
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">آمار کلی</h4>
                    <div className="space-y-3">
                      {attendanceData.map((month, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <h5 className="font-sahel font-bold mb-2">{month.month}</h5>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="font-dana">حضور:</span>
                              <span className="font-bold text-green-600">{month.present} روز</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-dana">غیبت:</span>
                              <span className="font-bold text-red-600">{month.absent} روز</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-dana">تأخیر:</span>
                              <span className="font-bold text-yellow-600">{month.late} روز</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">نمودار حضور</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="font-dana text-sm">درصد حضور کل</span>
                          <span className="font-dana text-sm">{children[0].attendance}٪</span>
                        </div>
                        <Progress value={children[0].attendance} className="h-3" />
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h5 className="font-sahel font-bold text-green-800 mb-2">وضعیت عالی!</h5>
                        <p className="font-dana text-sm text-green-700">
                          فرزند شما حضور بسیار خوبی دارد و به موقع در کلاس‌ها شرکت می‌کند.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  رویدادها و تاریخ‌های مهم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          event.type === 'exam' ? 'bg-red-100' : 
                          event.type === 'meeting' ? 'bg-blue-100' : 'bg-yellow-100'
                        }`}>
                          <Calendar className={`w-4 h-4 ${
                            event.type === 'exam' ? 'text-red-600' : 
                            event.type === 'meeting' ? 'text-blue-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{event.title}</h4>
                          <p className="font-dana text-sm text-gray-600">
                            {event.date} {event.time !== '-' && `- ${event.time}`}
                          </p>
                        </div>
                      </div>
                      <Badge variant={
                        event.type === 'exam' ? 'destructive' : 
                        event.type === 'meeting' ? 'default' : 'secondary'
                      }>
                        {event.type === 'exam' ? 'آزمون' : 
                         event.type === 'meeting' ? 'جلسه' : 'مهلت'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  پیام‌ها و اطلاعیه‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`p-4 rounded-lg border-2 ${
                      message.unread ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/10 p-2 rounded-lg">
                            <Mail className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-sahel font-bold text-gray-800">{message.subject}</h4>
                            <p className="font-dana text-sm text-gray-600 mb-1">{message.from}</p>
                            <p className="font-dana text-xs text-gray-500">{message.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {message.unread && (
                            <Badge variant="destructive" className="text-xs">جدید</Badge>
                          )}
                          <Button size="sm" variant="outline" className="font-sahel">
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  اطلاعات خانواده
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات والدین</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام پدر:</span>
                        <span className="font-bold">محمد احمدی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام مادر:</span>
                        <span className="font-bold">فاطمه کریمی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">شماره تماس:</span>
                        <span className="font-bold">۰۹۱۲۳۴۵۶۷۸۹</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">ایمیل:</span>
                        <span className="font-bold">m.ahmadi@email.com</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات فرزند</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام و نام خانوادگی:</span>
                        <span className="font-bold">{children[0].name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">پایه تحصیلی:</span>
                        <span className="font-bold">{children[0].grade}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">کلاس:</span>
                        <span className="font-bold">{children[0].class}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">شماره دانش‌آموزی:</span>
                        <span className="font-bold">۱۲۳۴۵۶</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button className="font-sahel">
                    ویرایش اطلاعات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-shabnam font-bold mb-4">دسترسی سریع</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Phone className="w-6 h-6" />
              تماس با مدرسه
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <MessageSquare className="w-6 h-6" />
              پیام به معلم
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Calendar className="w-6 h-6" />
              رزرو جلسه
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <FileText className="w-6 h-6" />
              گزارش عملکرد
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}