import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  ChartLine, 
  Video, 
  CheckCircle, 
  Brain,
  BarChart3,
  Bell,
  Lightbulb,
  Calendar,
  MessageSquare,
  FileText,
  Shield,
  Clock,
  Target,
  Award,
  Heart,
  BookOpen,
  Zap
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center justify-between">
            <div className="flex items-center space-x-reverse space-x-4">
              <div className="bg-primary p-2 rounded-lg">
                <GraduationCap className="text-white text-xl w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-shabnam font-bold text-primary">دفتر رابط</h1>
                <p className="text-sm font-dana text-gray-600">پلتفرم مدیریت هوشمند آموزش</p>
              </div>
            </div>
            <div className="flex items-center space-x-reverse space-x-4">
              <Button variant="ghost" className="font-sahel text-gray-600 hover:text-primary" onClick={() => window.location.href = '/'}>
                صفحه اصلی
              </Button>
              <Button variant="ghost" className="font-sahel text-gray-600 hover:text-primary" onClick={() => window.location.href = '/contact'}>
                تماس با ما
              </Button>
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="font-sahel bg-primary text-white hover:bg-primary/90"
              >
                ورود به سیستم
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-shabnam font-bold text-primary mb-6 leading-tight">
              درباره دفتر رابط
            </h2>
            <p className="text-xl font-dana text-gray-600 mb-8 leading-relaxed">
              سیستم جامع مدیریت آموزشی که با قدرت هوش مصنوعی، تجربه‌ای نوین از آموزش دیجیتال ارائه می‌دهد
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-shabnam font-bold text-primary mb-6">
                  ماموریت ما
                </h3>
                <p className="text-lg font-dana text-gray-600 mb-6 leading-relaxed">
                  دفتر رابط با هدف ایجاد پلی میان تکنولوژی مدرن و نیازهای آموزشی طراحی شده است. ما به دنبال ارائه ابزارهایی هستیم که فرایند یادگیری و تدریس را بهبود بخشد.
                </p>
                <div className="grid gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <span className="font-dana text-gray-700">تسهیل فرایندهای آموزشی</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary/10 p-2 rounded-lg">
                      <Heart className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="font-dana text-gray-700">حمایت از رشد دانش‌آموزان</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-accent/10 p-2 rounded-lg">
                      <Brain className="w-5 h-5 text-accent" />
                    </div>
                    <span className="font-dana text-gray-700">استفاده از هوش مصنوعی</span>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
                      <Users className="w-8 h-8 text-primary mx-auto" />
                    </div>
                    <h4 className="font-sahel font-bold text-gray-700">کاربران متنوع</h4>
                    <p className="font-dana text-sm text-gray-600">پشتیبانی از همه نقش‌ها</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
                      <ChartLine className="w-8 h-8 text-secondary mx-auto" />
                    </div>
                    <h4 className="font-sahel font-bold text-gray-700">تحلیل هوشمند</h4>
                    <p className="font-dana text-sm text-gray-600">گزارش‌های جامع</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
                      <Shield className="w-8 h-8 text-accent mx-auto" />
                    </div>
                    <h4 className="font-sahel font-bold text-gray-700">امنیت بالا</h4>
                    <p className="font-dana text-sm text-gray-600">حفاظت از اطلاعات</p>
                  </div>
                  <div className="text-center">
                    <div className="bg-white p-4 rounded-xl shadow-sm mb-3">
                      <Zap className="w-8 h-8 text-primary mx-auto" />
                    </div>
                    <h4 className="font-sahel font-bold text-gray-700">عملکرد سریع</h4>
                    <p className="font-dana text-sm text-gray-600">پاسخ فوری</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-shabnam font-bold text-primary mb-4">
                ویژگی‌های کلیدی
              </h3>
              <p className="text-lg font-dana text-gray-600">
                ابزارهای پیشرفته برای مدیریت شامل آموزش
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">مدیریت تکالیف</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    ایجاد، ارسال و نمره‌دهی تکالیف با سیستم هوشمند
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-secondary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">حضور و غیاب</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    ثبت دقیق حضور و غیاب با تحلیل الگوهای رفتاری
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-accent/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Video className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">کلاس آنلاین</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    برگزاری کلاس‌های مجازی با امکانات پیشرفته
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-primary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">بانک سوالات</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    مجموعه جامع سوالات دسته‌بندی شده
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-secondary/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <BarChart3 className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">تحلیل هوشمند</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    گزارش‌های تحلیلی با قدرت هوش مصنوعی
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="bg-accent/10 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <MessageSquare className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-sahel text-xl text-gray-800">مشاوره آنلاین</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 text-center">
                    جلسات مشاوره تخصصی و پیگیری روانشناختی
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-shabnam font-bold text-primary mb-4">
                کاربران سیستم
              </h3>
              <p className="text-lg font-dana text-gray-600">
                طراحی شده برای همه اعضای خانواده بزرگ آموزش
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-blue-100 text-blue-800 mb-3">دانش‌آموز</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل دانش‌آموزی</h4>
                  <p className="font-dana text-sm text-gray-600">مشاهده تکالیف، نمرات، برنامه کلاسی و ارتباط با معلمان</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-green-100 text-green-800 mb-3">معلم</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل معلم</h4>
                  <p className="font-dana text-sm text-gray-600">مدیریت کلاس، ایجاد تکلیف، ثبت نمرات و تحلیل عملکرد</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-orange-100 text-orange-800 mb-3">مشاور</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل مشاور</h4>
                  <p className="font-dana text-sm text-gray-600">جلسات مشاوره، پیگیری روانشناختی و تحلیل رفتاری</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-purple-100 text-purple-800 mb-3">معاون آموزشی</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل معاون</h4>
                  <p className="font-dana text-sm text-gray-600">نظارت کلی، گزارش‌گیری و مدیریت آموزشی</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-teal-100 text-teal-800 mb-3">دفتر رابط</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل رابط</h4>
                  <p className="font-dana text-sm text-gray-600">ارتباط با اولیا، مدیریت ارتباطات و اطلاع‌رسانی</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
                <div className="text-center">
                  <Badge className="bg-pink-100 text-pink-800 mb-3">ولی</Badge>
                  <h4 className="font-sahel font-bold text-gray-800 mb-2">پنل اولیا</h4>
                  <p className="font-dana text-sm text-gray-600">پیگیری فرزند، مشاهده پیشرفت و ارتباط با مدرسه</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-shabnam font-bold text-primary mb-8">
              ارزش‌های ما
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <h4 className="font-sahel font-bold text-gray-800 mb-2">کیفیت</h4>
                <p className="font-dana text-gray-600">ارائه بهترین خدمات آموزشی</p>
              </div>
              <div className="text-center">
                <div className="bg-secondary/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Lightbulb className="w-10 h-10 text-secondary" />
                </div>
                <h4 className="font-sahel font-bold text-gray-800 mb-2">نوآوری</h4>
                <p className="font-dana text-gray-600">استفاده از جدیدترین تکنولوژی‌ها</p>
              </div>
              <div className="text-center">
                <div className="bg-accent/10 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-accent" />
                </div>
                <h4 className="font-sahel font-bold text-gray-800 mb-2">همکاری</h4>
                <p className="font-dana text-gray-600">تقویت روح تیمی در آموزش</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-secondary">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h3 className="text-3xl font-shabnam font-bold mb-4">
              آماده شروع هستید؟
            </h3>
            <p className="text-xl font-dana mb-8">
              همین امروز به خانواده بزرگ دفتر رابط بپیوندید
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 text-lg font-sahel"
            >
              شروع کنید
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-primary p-2 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-shabnam font-bold text-xl">دفتر رابط</h4>
                </div>
                <p className="font-dana text-gray-300">
                  پلتفرم مدیریت هوشمند آموزش با قدرت هوش مصنوعی
                </p>
              </div>
              <div>
                <h5 className="font-sahel font-bold mb-4">صفحات</h5>
                <ul className="font-dana space-y-2 text-gray-300">
                  <li><a href="/" className="hover:text-white">صفحه اصلی</a></li>
                  <li><a href="/about" className="hover:text-white">درباره ما</a></li>
                  <li><a href="/contact" className="hover:text-white">تماس با ما</a></li>
                </ul>
              </div>
              <div>
                <h5 className="font-sahel font-bold mb-4">خدمات</h5>
                <ul className="font-dana space-y-2 text-gray-300">
                  <li>مدیریت تکالیف</li>
                  <li>کلاس آنلاین</li>
                  <li>تحلیل هوشمند</li>
                  <li>مشاوره آنلاین</li>
                </ul>
              </div>
              <div>
                <h5 className="font-sahel font-bold mb-4">ارتباط</h5>
                <ul className="font-dana space-y-2 text-gray-300">
                  <li>پشتیبانی ۲۴ ساعته</li>
                  <li>راهنمای کاربری</li>
                  <li>آموزش‌های ویدئویی</li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="font-dana text-gray-300">
                © ۱۴۰۳ دفتر رابط. تمامی حقوق محفوظ است.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}