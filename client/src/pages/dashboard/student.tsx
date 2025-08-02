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
  User,
  MessageSquare,
  BarChart3,
  AlertCircle,
  Award,
  Target
} from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function StudentDashboard() {
  // Mock data - replace with real API calls
  const assignments = [
    { id: 1, title: "تمرین ریاضی فصل ۳", subject: "ریاضی", dueDate: "۱۴۰۳/۰۸/۱۵", status: "pending" },
    { id: 2, title: "انشا فارسی", subject: "فارسی", dueDate: "۱۴۰۳/۰۸/۲۰", status: "submitted" },
    { id: 3, title: "آزمایش فیزیک", subject: "فیزیک", dueDate: "۱۴۰۳/۰۸/۲۵", status: "pending" }
  ];

  const upcomingClasses = [
    { id: 1, subject: "ریاضی", teacher: "آقای احمدی", time: "۰۸:۰۰", room: "کلاس ۱۰۱" },
    { id: 2, subject: "فیزیک", teacher: "خانم رضایی", time: "۰۹:۳۰", room: "آزمایشگاه" },
    { id: 3, subject: "فارسی", teacher: "آقای محمدی", time: "۱۱:۰۰", room: "کلاس ۲۰۳" }
  ];

  const grades = [
    { subject: "ریاضی", grade: 18.5, total: 20 },
    { subject: "فیزیک", grade: 17, total: 20 },
    { subject: "فارسی", grade: 19, total: 20 },
    { subject: "شیمی", grade: 16.5, total: 20 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-shabnam font-bold text-gray-900 mb-2">پنل دانش‌آموز</h1>
          <p className="font-dana text-gray-600">خوش آمدید! از اینجا می‌توانید تکالیف، نمرات و برنامه کلاسی خود را مشاهده کنید.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Stats */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-blue-800">تکالیف معوق</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">۲</div>
              <p className="text-xs text-blue-600 font-dana">نیاز به انجام دارد</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-green-800">میانگین نمرات</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">۱۷.۷۵</div>
              <p className="text-xs text-green-600 font-dana">از ۲۰</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-sahel font-medium text-purple-800">حضور</CardTitle>
              <Award className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">۹۵٪</div>
              <p className="text-xs text-purple-600 font-dana">در این ماه</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="assignments" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="assignments" className="font-sahel">تکالیف</TabsTrigger>
            <TabsTrigger value="schedule" className="font-sahel">برنامه کلاسی</TabsTrigger>
            <TabsTrigger value="grades" className="font-sahel">نمرات</TabsTrigger>
            <TabsTrigger value="attendance" className="font-sahel">حضور و غیاب</TabsTrigger>
            <TabsTrigger value="profile" className="font-sahel">پروفایل</TabsTrigger>
          </TabsList>

          <TabsContent value="assignments">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  تکالیف من
                </CardTitle>
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
                          <p className="font-dana text-sm text-gray-600">{assignment.subject}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={assignment.status === 'submitted' ? 'default' : 'destructive'}>
                          {assignment.status === 'submitted' ? 'تحویل داده شده' : 'در انتظار'}
                        </Badge>
                        <div className="text-left">
                          <p className="font-dana text-sm text-gray-600">مهلت تحویل</p>
                          <p className="font-dana text-sm font-bold">{assignment.dueDate}</p>
                        </div>
                        <Button size="sm" variant="outline" className="font-sahel">
                          مشاهده
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
                  برنامه کلاسی امروز
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingClasses.map((class_item) => (
                    <div key={class_item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="bg-secondary/10 p-2 rounded-lg">
                          <GraduationCap className="w-4 h-4 text-secondary" />
                        </div>
                        <div>
                          <h4 className="font-sahel font-bold text-gray-800">{class_item.subject}</h4>
                          <p className="font-dana text-sm text-gray-600">{class_item.teacher}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">زمان</p>
                          <p className="font-dana font-bold">{class_item.time}</p>
                        </div>
                        <div className="text-center">
                          <p className="font-dana text-sm text-gray-600">مکان</p>
                          <p className="font-dana font-bold">{class_item.room}</p>
                        </div>
                        <Button size="sm" variant="outline" className="font-sahel">
                          <Video className="w-4 h-4 ml-2" />
                          ورود به کلاس
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
                  نمرات و عملکرد
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {grades.map((grade, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-sahel font-bold text-gray-800">{grade.subject}</span>
                        <span className="font-dana text-lg font-bold text-primary">
                          {grade.grade} از {grade.total}
                        </span>
                      </div>
                      <Progress value={(grade.grade / grade.total) * 100} className="h-2" />
                      <p className="font-dana text-sm text-gray-600">
                        درصد: {Math.round((grade.grade / grade.total) * 100)}%
                      </p>
                    </div>
                  ))}
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
                      <div className="flex justify-between">
                        <span className="font-dana">کل حضورها:</span>
                        <span className="font-bold">۲۸ روز</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">غیبت‌ها:</span>
                        <span className="font-bold text-red-600">۲ روز</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">تأخیرها:</span>
                        <span className="font-bold text-yellow-600">۱ روز</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana">درصد حضور:</span>
                        <span className="font-bold text-green-600">۹۵٪</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-sahel font-bold text-lg mb-3">پیام مشاور</h4>
                    <p className="font-dana text-gray-600">
                      عملکرد حضور شما عالی است! ادامه دهید.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="font-shabnam text-xl flex items-center gap-2">
                  <User className="w-5 h-5" />
                  پروفایل من
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-sahel font-bold text-lg">اطلاعات شخصی</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">نام و نام خانوادگی:</span>
                        <span className="font-bold">علی احمدی</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">کد دانش‌آموزی:</span>
                        <span className="font-bold">۱۲۳۴۵۶</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">پایه:</span>
                        <span className="font-bold">دوازدهم</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">رشته:</span>
                        <span className="font-bold">ریاضی فیزیک</span>
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
                        <span className="font-bold">ali.ahmadi@school.edu</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-dana text-gray-600">آدرس:</span>
                        <span className="font-bold">تهران، منطقه ۱</span>
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
              پیام به معلم
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Calendar className="w-6 h-6" />
              برنامه هفتگی
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Target className="w-6 h-6" />
              اهداف تحصیلی
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2 font-sahel">
              <Clock className="w-6 h-6" />
              برنامه‌ریزی روزانه
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}