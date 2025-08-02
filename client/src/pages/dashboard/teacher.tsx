import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, 
  Calendar, 
  CheckCircle, 
  Clock, 
  FileText, 
  GraduationCap, 
  TrendingUp,
  Video,
  Users,
  MessageSquare,
  BarChart3,
  AlertCircle,
  Award,
  PlusCircle,
  Edit,
  Settings,
  Mail
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function TeacherDashboard() {
  // Mock data - replace with real API calls
  const classes = [
    { id: 1, name: "ریاضی دهم الف", students: 28, subject: "ریاضی", time: "۰۸:۰۰-۰۹:۳۰" },
    { id: 2, name: "ریاضی دهم ب", students: 25, subject: "ریاضی", time: "۱۰:۰۰-۱۱:۳۰" },
    { id: 3, name: "هندسه یازدهم", students: 22, subject: "هندسه", time: "۱۳:۰۰-۱۴:۳۰" }
  ];

  const assignments = [
    { id: 1, title: "تمرین فصل ۳", class: "دهم الف", submitted: 20, total: 28, pending: 8 },
    { id: 2, title: "آزمون میان‌ترم", class: "دهم ب", submitted: 25, total: 25, pending: 0 },
    { id: 3, title: "پروژه هندسه", class: "یازدهم", submitted: 15, total: 22, pending: 7 }
  ];

  const todaySchedule = [
    { time: "۰۸:۰۰", class: "ریاضی دهم الف", room: "کلاس ۱۰۱", type: "درس" },
    { time: "۱۰:۰۰", class: "ریاضی دهم ب", room: "کلاس ۱۰۲", type: "درس" },
    { time: "۱۳:۰۰", class: "هندسه یازدهم", room: "کلاس ۲۰۱", type: "درس" },
    { time: "۱۵:۰۰", class: "جلسه هیئت علمی", room: "سالن کنفرانس", type: "جلسه" }
  ];

  const recentMessages = [
    { id: 1, from: "علی احمدی", class: "دهم الف", message: "سوال در مورد تمرین فصل ۳", time: "۲ ساعت پیش" },
    { id: 2, from: "فاطمه رضایی", class: "دهم ب", message: "درخواست توضیح بیشتر", time: "۵ ساعت پیش" },
    { id: 3, from: "محمد کریمی", class: "یازدهم", message: "مشکل در پروژه هندسه", time: "۱ روز پیش" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-shabnam font-bold text-gray-900 mb-2">پنل معلم</h1>
          <p className="font-dana text-gray-600">خوش آمدید! مدیریت کلاس‌ها، تکالیف و ارتباط با دانش‌آموزان را از اینجا انجام دهید.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-green-800">کل دانش‌آموزان</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">۷۵</div>
              <p className="text-xs text-green-600 font-dana">در ۳ کلاس</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-blue-800">تکالیف بررسی نشده</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">۱۵</div>
              <p className="text-xs text-blue-600 font-dana">نیاز به بررسی</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-orange-800">پیام‌های جدید</CardTitle>
              <MessageSquare className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-900">۸</div>
              <p className="text-xs text-orange-600 font-dana">از دانش‌آموزان</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-purple-800">کلاس‌های امروز</CardTitle>
              <Calendar className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">۴</div>
              <p className="text-xs text-purple-600 font-dana">جلسه برنامه‌ریزی شده</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="classes" className="space-y-4">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="classes" className="font-sahel">کلاس‌ها</TabsTrigger>
            <TabsTrigger value="assignments" className="font-sahel">تکالیف</TabsTrigger>
            <TabsTrigger value="schedule" className="font-sahel">برنامه امروز</TabsTrigger>
            <TabsTrigger value="grades" className="font-sahel">نمرات</TabsTrigger>
            <TabsTrigger value="messages" className="font-sahel">پیام‌ها</TabsTrigger>
            <TabsTrigger value="profile" className="font-sahel">پروفایل</TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  کلاس‌های من
                </CardTitle>
                <Button className="font-sahel">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  کلاس جدید
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="border-2 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <CardTitle className="font-sahel text-lg">{classItem.name}</CardTitle>
                        <Badge variant="secondary" className="w-fit">{classItem.subject}</Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="font-dana text-gray-600">دانش‌آموزان:</span>
                          <span className="font-bold">{classItem.students} نفر</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-dana text-gray-600">زمان:</span>
                          <span className="font-bold">{classItem.time}</span>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline" className="flex-1 font-sahel">
                            مشاهده
                          </Button>
                          <Button size="sm" className="flex-1 font-sahel">
                            <Video className="w-4 h-4 ml-2" />
                            شروع کلاس
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  مدیریت تکالیف
                </CardTitle>
                <Button className="font-sahel">
                  <PlusCircle className="w-4 h-4 ml-2" />
                  تکلیف جدید
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <BookOpen className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{assignment.title}</h4>
                          <p className="font-dana text-sm text-gray-600">{assignment.class}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">تحویل داده شده</p>
                          <p className="font-dana font-bold text-green-600">{assignment.submitted}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">در انتظار</p>
                          <p className="font-dana font-bold text-red-600">{assignment.pending}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">کل</p>
                          <p className="font-dana font-bold">{assignment.total}</p>
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

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  برنامه امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todaySchedule.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <Clock className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{item.class}</h4>
                          <p className="font-dana text-sm text-gray-600">{item.room}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant={item.type === 'درس' ? 'default' : 'secondary'}>
                          {item.type}
                        </Badge>
                        <div className="text-center">
                          <p className="font-dana font-bold">{item.time}</p>
                        </div>
                        <Button size="sm" variant="outline" className="font-sahel">
                          جزئیات
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  مدیریت نمرات
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="border">
                      <CardHeader>
                        <CardTitle className="font-sahel text-lg">{classItem.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="font-dana">میانگین کلاس:</span>
                            <span className="font-bold">۱۶.۵</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-dana">بالاترین نمره:</span>
                            <span className="font-bold text-green-600">۲۰</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-dana">پایین‌ترین نمره:</span>
                            <span className="font-bold text-red-600">۱۲</span>
                          </div>
                          <Button size="sm" variant="outline" className="w-full font-sahel">
                            مشاهده جزئیات
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
                  پیام‌های اخیر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentMessages.map((message) => (
                    <div key={message.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Mail className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{message.from}</h4>
                          <p className="font-dana text-sm text-gray-600 mb-1">{message.class}</p>
                          <p className="font-dana text-gray-700">{message.message}</p>
                        </div>
                      </div>
                      <div className="text-left">
                        <p className="font-dana text-xs text-gray-500">{message.time}</p>
                        <Button size="sm" variant="outline" className="mt-2 font-sahel">
                          پاسخ
                        </Button>
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
                  پروفایل معلم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات شخصی</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام و نام خانوادگی:</span>
                        <span className="font-bold">احمد محمدی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">کد پرسنلی:</span>
                        <span className="font-bold">۹۸۷۶۵۴</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">تخصص:</span>
                        <span className="font-bold">ریاضیات</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">سابقه تدریس:</span>
                        <span className="font-bold">۱۰ سال</span>
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
                        <span className="font-bold">ahmad.mohammadi@school.edu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">دفتر کار:</span>
                        <span className="font-bold">اتاق ۲۰۳</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Button className="font-sahel">
                    <Edit className="w-4 h-4 ml-2" />
                    ویرایش اطلاعات
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}