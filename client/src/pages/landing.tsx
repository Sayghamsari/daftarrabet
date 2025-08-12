import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  ChartLine, 
  Video, 
  CheckCircle, 
  Rocket,
  Play,
  Check,
  Brain,
  BarChart3,
  Bell,
  Lightbulb,
  Calendar,
  MessageSquare,
  FileText,
  PieChart,
  Shield,
  Clock,
  Phone,
  Mail
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Header */}
      <header className="glass backdrop-blur-md border-b border-primary/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="gradient-primary p-2 rounded-xl animate-bounce-soft">
                <GraduationCap className="text-white text-xl w-7 h-7" />
              </div>
              <div>
                <h1 className="text-xl font-shabnam font-bold text-gradient">دفتر رابط - پلتفرم مدیریت هوشمند آموزش</h1>
                <p className="text-sm font-dana text-muted-foreground">سیستم جامع مدرسه‌ای با قدرت هوش مصنوعی</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <Button 
                variant="ghost" 
                className="font-vazir text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => window.location.href = '/about'}
              >
                درباره ما
              </Button>
              <Button 
                variant="ghost" 
                className="font-vazir text-muted-foreground hover:text-primary hover:bg-primary/10"
                onClick={() => window.location.href = '/contact'}
              >
                تماس با ما
              </Button>
              <Button 
                onClick={() => window.location.href = '/auth'}
                className="font-dana btn-gradient shadow-primary hover:shadow-xl"
              >
                ورود به سیستم
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-primary py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-shabnam font-bold text-white mb-6 leading-tight animate-float">
              مدیریت هوشمند آموزش با قدرت هوش مصنوعی
            </h2>
            <p className="text-xl font-vazir text-white/90 mb-8 leading-relaxed">
              پلتفرمی جامع برای مدیریت فرایندهای آموزشی، ارتقاء ارتباطات مدرسه‌ای و پشتیبانی از دانش‌آموزان، معلمان و اولیا با تحلیل‌های هوشمند
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/auth'}
                className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-dana shadow-xl hover:shadow-2xl"
              >
                <Rocket className="ml-2 w-5 h-5" />
                شروع آزمایشی ۱۴ روزه رایگان
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-4 text-lg font-dana"
              >
                <Play className="ml-2 w-5 h-5" />
                مشاهده ویدئو معرفی
              </Button>
            </div>
            <div className="mt-8 flex justify-center items-center space-x-reverse space-x-8 text-sm text-white/80">
              <div className="flex items-center font-vazir">
                <Check className="text-white ml-2 w-4 h-4" />
                بدون نیاز به کارت اعتباری
              </div>
              <div className="flex items-center font-vazir">
                <Check className="text-white ml-2 w-4 h-4" />
                پشتیبانی ۲۴/۷
              </div>
              <div className="flex items-center font-vazir">
                <Check className="text-white ml-2 w-4 h-4" />
                امکان لغو هر زمان
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">امکانات ویژه برای هر نقش</h3>
            <p className="text-lg text-gray-600">پلتفرمی طراحی‌شده برای پاسخ‌گویی به نیازهای مختلف کاربران مدرسه</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Role */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-blue-700 mb-3">دانش‌آموز</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-blue-500 ml-2 w-4 h-4" />
                    کلاس‌های آنلاین تعاملی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-blue-500 ml-2 w-4 h-4" />
                    آزمون‌های هوشمند و تکالیف
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-blue-500 ml-2 w-4 h-4" />
                    برنامه مطالعاتی شخصی‌سازی‌شده
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-blue-500 ml-2 w-4 h-4" />
                    مشاوره فردی و گروهی
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Teacher Role */}
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-green-700 mb-3">معلم</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 ml-2 w-4 h-4" />
                    مدیریت کلاس و محتوای آموزشی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 ml-2 w-4 h-4" />
                    طراحی آزمون و تصحیح هوشمند
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 ml-2 w-4 h-4" />
                    ثبت حضور و غیاب دیجیتال
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-green-500 ml-2 w-4 h-4" />
                    گزارش‌های تحلیلی عملکرد
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Educational Deputy Role */}
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <ChartLine className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-purple-700 mb-3">معاون آموزشی</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-purple-500 ml-2 w-4 h-4" />
                    داشبورد مدیریتی جامع با AI
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-purple-500 ml-2 w-4 h-4" />
                    هشدارهای هوشمند و نوتیفیکیشن
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-purple-500 ml-2 w-4 h-4" />
                    نظارت بر عملکرد کادر آموزشی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-purple-500 ml-2 w-4 h-4" />
                    مدیریت برنامه درسی و تقویم
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Counselor Role */}
            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-orange-700 mb-3">مشاور</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-orange-500 ml-2 w-4 h-4" />
                    مدیریت جلسات مشاوره فردی/گروهی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-orange-500 ml-2 w-4 h-4" />
                    ثبت و پیگیری جلسات مشاوره
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-orange-500 ml-2 w-4 h-4" />
                    دسترسی به اطلاعات تحصیلی و رفتاری
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-orange-500 ml-2 w-4 h-4" />
                    تحلیل روند پیشرفت دانش‌آموزان
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Liaison Office Role */}
            <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-teal-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-teal-700 mb-3">دفتر رابط</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-teal-500 ml-2 w-4 h-4" />
                    مدیریت ارتباطات خارجی
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-teal-500 ml-2 w-4 h-4" />
                    رویدادها و فعالیت‌های فوق‌برنامه
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-teal-500 ml-2 w-4 h-4" />
                    سیستم ثبت‌نام جدید
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-teal-500 ml-2 w-4 h-4" />
                    مدیریت فارغ‌التحصیلان
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Parents Role */}
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="bg-pink-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <Users className="text-white w-6 h-6" />
                </div>
                <h4 className="text-xl font-bold text-pink-700 mb-3">اولیا</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <CheckCircle className="text-pink-500 ml-2 w-4 h-4" />
                    مشاهده کارنامه و وضعیت حضور
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-pink-500 ml-2 w-4 h-4" />
                    دریافت اطلاعیه‌ها و هشدارها
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-pink-500 ml-2 w-4 h-4" />
                    ارتباط مستقیم با معلمان
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="text-pink-500 ml-2 w-4 h-4" />
                    پیگیری برنامه مطالعاتی فرزند
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 mb-4">
              <Brain className="ml-2 w-4 h-4" />
              هوش مصنوعی
            </Badge>
            <h3 className="text-3xl font-bold text-gray-800 mb-4">تحلیل‌های هوشمند و گزارش‌دهی پیشرفته</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">با قدرت هوش مصنوعی، داده‌های آموزشی را تحلیل کرده و بینش‌های عمیق ارائه دهید</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Card className="bg-white shadow-lg border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-500 p-2 rounded-lg ml-3">
                      <BarChart3 className="text-white w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">تحلیل عملکرد هوشمند</h4>
                  </div>
                  <p className="text-gray-600">شناسایی الگوهای یادگیری، نقاط ضعف و قوت دانش‌آموزان با دقت بالا</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-green-500 p-2 rounded-lg ml-3">
                      <Bell className="text-white w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">هشدارهای پیش‌بینانه</h4>
                  </div>
                  <p className="text-gray-600">هشدار زودهنگام برای افت تحصیلی، غیبت‌های مکرر و تغییرات رفتاری</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-gray-100">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-purple-500 p-2 rounded-lg ml-3">
                      <Lightbulb className="text-white w-5 h-5" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-800">پیشنهادات آموزشی</h4>
                  </div>
                  <p className="text-gray-600">ارائه روش‌های تدریس بهینه و منابع مطالعاتی متناسب با هر دانش‌آموز</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white shadow-xl border-gray-100">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-gray-800 mb-2">داشبورد تحلیلی هوشمند</h4>
                  <p className="text-sm text-gray-600">نمونه‌ای از تحلیل‌های AI برای کلاس ریاضی پایه نهم</p>
                </div>
                
                {/* Performance Chart */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-700">میانگین نمرات کلاس</span>
                    <span className="text-sm text-green-600">+12% نسبت به ماه قبل</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>78%</span>
                    <span>100</span>
                  </div>
                </div>

                {/* AI Insights */}
                <div className="space-y-3">
                  <div className="bg-blue-50 p-3 rounded-lg border-r-4 border-blue-500">
                    <div className="flex items-center mb-1">
                      <Brain className="text-blue-500 ml-2 w-4 h-4" />
                      <span className="text-sm font-medium text-blue-700">بینش هوش مصنوعی</span>
                    </div>
                    <p className="text-xs text-blue-600">دانش‌آموزان در بخش هندسه نیاز به تمرین بیشتر دارند</p>
                  </div>
                  
                  <div className="bg-yellow-50 p-3 rounded-lg border-r-4 border-yellow-500">
                    <div className="flex items-center mb-1">
                      <Bell className="text-yellow-500 ml-2 w-4 h-4" />
                      <span className="text-sm font-medium text-yellow-700">هشدار</span>
                    </div>
                    <p className="text-xs text-yellow-600">3 دانش‌آموز در معرض ریزش تحصیلی قرار دارند</p>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg border-r-4 border-green-500">
                    <div className="flex items-center mb-1">
                      <CheckCircle className="text-green-500 ml-2 w-4 h-4" />
                      <span className="text-sm font-medium text-green-700">نکته مثبت</span>
                    </div>
                    <p className="text-xs text-green-600">کیفیت تعامل در کلاس‌های آنلاین بهبود یافته</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">امکانات کلیدی پلتفرم</h3>
            <p className="text-lg text-gray-600">تمام ابزارهای مورد نیاز برای مدیریت مدرن آموزش</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Online Classroom */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Video className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">کلاس آنلاین</h4>
              <p className="text-gray-600 text-sm">پشتیبانی از Adobe Connect، BigBlueButton و SkyRoom</p>
            </div>

            {/* Assignment Management */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-green-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">مدیریت تکالیف</h4>
              <p className="text-gray-600 text-sm">سیستم پیشرفته نمره‌دهی و ردیابی پیشرفت</p>
            </div>

            {/* Attendance System */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Calendar className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">حضور و غیاب</h4>
              <p className="text-gray-600 text-sm">ثبت دقیق ورود/خروج و اطلاع‌رسانی به اولیا</p>
            </div>

            {/* Question Bank */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">بانک سؤال</h4>
              <p className="text-gray-600 text-sm">مجموعه منظم سؤالات با قابلیت جستجو و دسته‌بندی</p>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Examination System */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-red-500 to-red-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">سیستم آزمون</h4>
              <p className="text-gray-600 text-sm">برگزاری آزمون‌های آنلاین با امنیت بالا</p>
            </div>

            {/* File Management */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileText className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">مدیریت فایل</h4>
              <p className="text-gray-600 text-sm">آپلود و سازماندهی منابع آموزشی</p>
            </div>

            {/* Communication */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">ارتباطات</h4>
              <p className="text-gray-600 text-sm">پیام‌رسان داخلی و اطلاع‌رسانی هوشمند</p>
            </div>

            {/* Reports & Analytics */}
            <div className="text-center group">
              <div className="bg-gradient-to-br from-pink-500 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <PieChart className="text-white w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-2">گزارش‌ها</h4>
              <p className="text-gray-600 text-sm">تحلیل‌های جامع و گزارش‌های تخصصی</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing/Trial Section */}
      <section className="py-16 bg-gradient-to-b from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-primary mb-4">همین امروز شروع کنید</h3>
              <p className="text-lg text-primary/80">۱۴ روز کاملاً رایگان، بدون هیچ محدودیتی</p>
            </div>

            <Card className="bg-white shadow-xl">
              <CardContent className="p-8 md:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <Badge className="bg-secondary/10 text-secondary hover:bg-secondary/20 mb-6">
                      <Shield className="ml-2 w-4 h-4" />
                      پیشنهاد ویژه
                    </Badge>
                    <h4 className="text-2xl font-bold text-gray-800 mb-4">آزمایش کامل و رایگان</h4>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="text-secondary ml-3 w-5 h-5" />
                        دسترسی کامل به تمام امکانات
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="text-secondary ml-3 w-5 h-5" />
                        پشتیبانی فنی ۲۴ ساعته
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="text-secondary ml-3 w-5 h-5" />
                        راه‌اندازی و آموزش رایگان
                      </li>
                      <li className="flex items-center text-gray-700">
                        <CheckCircle className="text-secondary ml-3 w-5 h-5" />
                        بدون نیاز به کارت اعتباری
                      </li>
                    </ul>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        size="lg"
                        onClick={() => window.location.href = '/auth'}
                        className="bg-secondary text-white hover:bg-secondary/90 flex-1"
                      >
                        شروع آزمایشی رایگان
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        درخواست دمو
                      </Button>
                    </div>
                  </div>
                  
                  <div className="relative">
                    {/* Features Preview */}
                    <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                      <CardContent className="p-6">
                        <h5 className="font-bold text-gray-800 mb-4">در آزمایش ۱۴ روزه دریافت خواهید کرد:</h5>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">تعداد دانش‌آموزان</span>
                            <span className="font-bold text-blue-600">نامحدود</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">فضای ذخیره‌سازی</span>
                            <span className="font-bold text-blue-600">۱۰ گیگابایت</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">کلاس‌های همزمان</span>
                            <span className="font-bold text-blue-600">تا ۵ کلاس</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700">گزارش‌های AI</span>
                            <span className="font-bold text-blue-600">✓ فعال</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Badge */}
                    <div className="absolute -top-4 -left-4 bg-accent text-white px-4 py-2 rounded-full text-sm font-bold transform rotate-12">
                      ۱۴ روز رایگان!
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-reverse space-x-3 mb-4">
                <div className="bg-primary p-2 rounded-lg">
                  <GraduationCap className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">پلتفرم مدیریت هوشمند آموزش</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                سیستم جامع مدرسه‌ای با قدرت هوش مصنوعی برای ارتقاء کیفیت آموزش و یادگیری
              </p>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">امکانات</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">کلاس آنلاین</a></li>
                <li><a href="#" className="hover:text-white transition-colors">مدیریت تکالیف</a></li>
                <li><a href="#" className="hover:text-white transition-colors">سیستم آزمون</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تحلیل‌های AI</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">پشتیبانی</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">مرکز راهنمایی</a></li>
                <li><a href="#" className="hover:text-white transition-colors">تماس با ما</a></li>
                <li><a href="#" className="hover:text-white transition-colors">گزارش مشکل</a></li>
                <li><a href="#" className="hover:text-white transition-colors">درخواست دمو</a></li>
              </ul>
            </div>
            
            <div>
              <h5 className="font-bold mb-4">تماس با ما</h5>
              <div className="space-y-3 text-gray-400 text-sm">
                <div className="flex items-center">
                  <Phone className="ml-3 text-primary w-4 h-4" />
                  <span>۰۲۱-۱۲۳۴۵۶۷۸</span>
                </div>
                <div className="flex items-center">
                  <Mail className="ml-3 text-primary w-4 h-4" />
                  <span>info@platform.ir</span>
                </div>
                <div className="flex items-center">
                  <Clock className="ml-3 text-primary w-4 h-4" />
                  <span>پشتیبانی ۲۴/۷</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; ۱۴۰۳ پلتفرم مدیریت هوشمند آموزش. تمامی حقوق محفوظ است.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
