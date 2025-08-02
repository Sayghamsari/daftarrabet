import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, 
  Calendar, 
  Users, 
  MessageSquare,
  Brain,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  User,
  Settings,
  PlusCircle,
  BarChart3,
  Shield,
  Target
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function CounselorDashboard() {
  // Mock data - replace with real API calls
  const todaySessions = [
    { id: 1, student: "علی احمدی", time: "۰۹:۰۰", type: "مشاوره تحصیلی", status: "scheduled" },
    { id: 2, student: "فاطمه رضایی", time: "۱۰:۳۰", type: "مشاوره روانشناختی", status: "scheduled" },
    { id: 3, student: "محمد کریمی", time: "۱۴:۰۰", type: "مشاوره شغلی", status: "completed" }
  ];

  const recentReports = [
    { id: 1, student: "سارا احمدی", issue: "کاهش عملکرد تحصیلی", priority: "high", date: "۱۴۰۳/۰۸/۱۰" },
    { id: 2, student: "رضا محمدی", issue: "مشکلات انطباقی", priority: "medium", date: "۱۴۰۳/۰۸/۰۸" },
    { id: 3, student: "مریم حسینی", issue: "اضطراب امتحان", priority: "high", date: "۱۴۰۳/۰۸/۰۵" }
  ];

  const studentsUnderCare = [
    { id: 1, name: "علی احمدی", grade: "دهم", sessions: 8, lastSession: "۱۴۰۳/۰۸/۱۰", status: "active" },
    { id: 2, name: "فاطمه رضایی", grade: "یازدهم", sessions: 12, lastSession: "۱۴۰۳/۰۸/۰۸", status: "active" },
    { id: 3, name: "محمد کریمی", grade: "دوازدهم", sessions: 6, lastSession: "۱۴۰۳/۰۸/۰۵", status: "completed" }
  ];

  const monthlyStats = {
    totalSessions: 45,
    completedSessions: 38,
    newCases: 12,
    resolvedCases: 8
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-shabnam font-bold text-gray-900 mb-2">پنل مشاور</h1>
          <p className="font-dana text-gray-600">خوش آمدید! مدیریت جلسات مشاوره، پیگیری دانش‌آموزان و تحلیل روانشناختی را از اینجا انجام دهید.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-pink-800">جلسات امروز</CardTitle>
              <Calendar className="h-4 w-4 text-pink-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-900">{todaySessions.length}</div>
              <p className="text-xs text-pink-600 font-dana">برنامه‌ریزی شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-orange-800">موارد فوری</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">۳</div>
              <p className="text-xs text-orange-600 font-dana">نیاز به بررسی</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-green-800">جلسات این ماه</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{monthlyStats.completedSessions}</div>
              <p className="text-xs text-green-600 font-dana">از {monthlyStats.totalSessions} انجام شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-blue-800">دانش‌آموزان تحت پوشش</CardTitle>
              <Users className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{studentsUnderCare.filter(s => s.status === 'active').length}</div>
              <p className="text-xs text-blue-600 font-dana">فعال</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="sessions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="sessions" className="font-sahel">جلسات امروز</TabsTrigger>
            <TabsTrigger value="students" className="font-sahel">دانش‌آموزان</TabsTrigger>
            <TabsTrigger value="reports" className="font-sahel">گزارش‌ها</TabsTrigger>
            <TabsTrigger value="analytics" className="font-sahel">تحلیل‌ها</TabsTrigger>
            <TabsTrigger value="resources" className="font-sahel">منابع</TabsTrigger>
            <TabsTrigger value="profile" className="font-sahel">پروفایل</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  جلسات مشاوره امروز
                </CardTitle>
                <Button className="font-sahel">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  جلسه جدید
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Heart className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{session.student}</h4>
                          <p className="font-dana text-sm text-gray-600">{session.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                          {session.status === 'completed' ? 'انجام شده' : 'برنامه‌ریزی شده'}
                        </Badge>
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">زمان</p>
                          <p className="font-dana font-bold">{session.time}</p>
                        </div>
                        <Button size="sm" variant="outline" className="font-sahel">
                          {session.status === 'completed' ? 'مشاهده' : 'شروع جلسه'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="students">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  دانش‌آموزان تحت پوشش
                </CardTitle>
                <Button className="font-sahel">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  افزودن دانش‌آموز
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {studentsUnderCare.map((student) => (
                    <Card key={student.id} className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="font-sahel text-lg">{student.name}</CardTitle>
                        <Badge variant="secondary" className="w-fit">{student.grade}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-dana text-gray-600">تعداد جلسات:</span>
                          <span className="font-bold">{student.sessions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-dana text-gray-600">آخرین جلسه:</span>
                          <span className="font-bold">{student.lastSession}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-dana text-gray-600">وضعیت:</span>
                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                            {student.status === 'active' ? 'فعال' : 'تکمیل شده'}
                          </Badge>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 font-sahel">
                            پرونده
                          </Button>
                          <Button size="sm" className="flex-1 font-sahel">
                            جلسه جدید
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  گزارش‌های اخیر
                </CardTitle>
                <Button className="font-sahel">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  گزارش جدید
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentReports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          report.priority === 'high' ? 'bg-red-100' : 'bg-yellow-100'
                        }`}>
                          <AlertTriangle className={`w-4 h-4 ${
                            report.priority === 'high' ? 'text-red-600' : 'text-yellow-600'
                          }`} />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{report.student}</h4>
                          <p className="font-dana text-sm text-gray-600">{report.issue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={report.priority === 'high' ? 'destructive' : 'secondary'}>
                          {report.priority === 'high' ? 'فوری' : 'متوسط'}
                        </Badge>
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">تاریخ</p>
                          <p className="font-dana font-bold">{report.date}</p>
                        </div>
                        <Button size="sm" variant="outline" className="font-sahel">
                          بررسی
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  تحلیل‌های روانشناختی
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">آمار کلی این ماه</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana">کل جلسات:</span>
                        <span className="font-bold">{monthlyStats.totalSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">جلسات انجام شده:</span>
                        <span className="font-bold text-green-600">{monthlyStats.completedSessions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">موارد جدید:</span>
                        <span className="font-bold text-blue-600">{monthlyStats.newCases}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">موارد حل شده:</span>
                        <span className="font-bold text-green-600">{monthlyStats.resolvedCases}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-sahel font-bold text-lg mb-3">نکات مهم</h4>
                    <ul className="font-dana text-gray-600 space-y-2">
                      <li>• افزایش ۱۵٪ در جلسات مشاوره تحصیلی</li>
                      <li>• کاهش ۲۰٪ در موارد اضطراب امتحان</li>
                      <li>• بهبود ۳۰٪ در رضایت دانش‌آموزان</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Brain className="w-5 h-5" />
                  منابع و ابزارهای مشاوره
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <Target className="w-8 h-8 text-primary" />
                      </div>
                      <CardTitle className="font-sahel text-lg">تست‌های روانشناختی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-dana text-gray-600 text-center text-sm">
                        مجموعه تست‌های استاندارد شخصیت‌شناسی
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="bg-secondary/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-secondary" />
                      </div>
                      <CardTitle className="font-sahel text-lg">فرم‌های ارزیابی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-dana text-gray-600 text-center text-sm">
                        فرم‌های ارزیابی و پیگیری پیشرفت
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-2 hover:border-primary/50 transition-colors cursor-pointer">
                    <CardHeader className="text-center">
                      <div className="bg-accent/10 p-3 rounded-full w-16 h-16 mx-auto mb-2 flex items-center justify-center">
                        <Shield className="w-8 h-8 text-accent" />
                      </div>
                      <CardTitle className="font-sahel text-lg">پروتکل‌های درمانی</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-dana text-gray-600 text-center text-sm">
                        راهنماهای درمان و مداخله
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  پروفایل مشاور
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات شخصی</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام و نام خانوادگی:</span>
                        <span className="font-bold">دکتر سارا رضایی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">کد پرسنلی:</span>
                        <span className="font-bold">۱۱۲۲۳۳</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">تخصص:</span>
                        <span className="font-bold">روانشناسی تربیتی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">سابقه کار:</span>
                        <span className="font-bold">۸ سال</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات تماس</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">شماره تماس:</span>
                        <span className="font-bold">۰۹۱۲۳۴۵۶۷۸۹</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">ایمیل:</span>
                        <span className="font-bold">sara.rezaei@school.edu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">دفتر کار:</span>
                        <span className="font-bold">اتاق مشاوره ۱</span>
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
              <MessageSquare className="w-6 h-6" />
              گزارش فوری
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Calendar className="w-6 h-6" />
              تنظیم جلسه
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Brain className="w-6 h-6" />
              تست روانشناختی
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <TrendingUp className="w-6 h-6" />
              تحلیل پیشرفت
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}