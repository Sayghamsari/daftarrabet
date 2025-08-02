import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  HeadphonesIcon,
  Globe,
  Users
} from "lucide-react";

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    alert("پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.");
  };

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
              <Button variant="ghost" className="font-sahel text-gray-600 hover:text-primary" onClick={() => window.location.href = '/about'}>
                درباره ما
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
              تماس با ما
            </h2>
            <p className="text-xl font-dana text-gray-600 mb-8 leading-relaxed">
              ما آماده پاسخگویی به سوالات شما هستیم. با ما در ارتباط باشید
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              <Card className="text-center bg-gradient-to-br from-primary/5 to-primary/10 border-0">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-sahel text-lg text-gray-800">تلفن پشتیبانی</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 mb-2">۰۲۱-۱۲۳۴۵۶۷۸</p>
                  <p className="font-dana text-sm text-gray-500">۲۴ ساعته در خدمت شما</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-secondary/5 to-secondary/10 border-0">
                <CardHeader>
                  <div className="bg-secondary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Mail className="w-8 h-8 text-secondary" />
                  </div>
                  <CardTitle className="font-sahel text-lg text-gray-800">ایمیل</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 mb-2">info@daftar-rabet.ir</p>
                  <p className="font-dana text-sm text-gray-500">پاسخ در کمتر از ۲۴ ساعت</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-accent/5 to-accent/10 border-0">
                <CardHeader>
                  <div className="bg-accent/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Clock className="w-8 h-8 text-accent" />
                  </div>
                  <CardTitle className="font-sahel text-lg text-gray-800">ساعات کاری</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 mb-2">شنبه تا پنج‌شنبه</p>
                  <p className="font-dana text-sm text-gray-500">۸:۰۰ تا ۱۷:۰۰</p>
                </CardContent>
              </Card>

              <Card className="text-center bg-gradient-to-br from-primary/5 to-secondary/5 border-0">
                <CardHeader>
                  <div className="bg-primary/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <HeadphonesIcon className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="font-sahel text-lg text-gray-800">پشتیبانی فنی</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-dana text-gray-600 mb-2">support@daftar-rabet.ir</p>
                  <p className="font-dana text-sm text-gray-500">رفع مشکلات فنی</p>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form and Info */}
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-shabnam text-2xl text-primary flex items-center gap-2">
                    <Send className="w-6 h-6" />
                    ارسال پیام
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="font-sahel text-gray-700">نام</Label>
                        <Input 
                          id="firstName" 
                          placeholder="نام خود را وارد کنید"
                          className="font-dana"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="font-sahel text-gray-700">نام خانوادگی</Label>
                        <Input 
                          id="lastName" 
                          placeholder="نام خانوادگی خود را وارد کنید"
                          className="font-dana"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="font-sahel text-gray-700">ایمیل</Label>
                      <Input 
                        id="email" 
                        type="email"
                        placeholder="example@email.com"
                        className="font-dana"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="font-sahel text-gray-700">شماره تماس</Label>
                      <Input 
                        id="phone" 
                        type="tel"
                        placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                        className="font-dana"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="font-sahel text-gray-700">موضوع</Label>
                      <Input 
                        id="subject" 
                        placeholder="موضوع پیام خود را وارد کنید"
                        className="font-dana"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="font-sahel text-gray-700">پیام</Label>
                      <Textarea 
                        id="message" 
                        placeholder="پیام خود را اینجا بنویسید..."
                        className="font-dana min-h-[120px]"
                        required
                      />
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full font-sahel bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4 ml-2" />
                      ارسال پیام
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <div className="space-y-8">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-primary/5 to-white">
                  <CardHeader>
                    <CardTitle className="font-shabnam text-xl text-primary flex items-center gap-2">
                      <MessageSquare className="w-6 h-6" />
                      چرا با ما تماس بگیرید؟
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary/10 p-2 rounded-lg mt-1">
                        <Users className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-sahel font-bold text-gray-800">مشاوره رایگان</h4>
                        <p className="font-dana text-sm text-gray-600">تیم متخصص ما آماده ارائه مشاوره رایگان در زمینه استفاده از سیستم</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-secondary/10 p-2 rounded-lg mt-1">
                        <HeadphonesIcon className="w-4 h-4 text-secondary" />
                      </div>
                      <div>
                        <h4 className="font-sahel font-bold text-gray-800">پشتیبانی فنی</h4>
                        <p className="font-dana text-sm text-gray-600">رفع مشکلات فنی و راهنمایی در استفاده از امکانات</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="bg-accent/10 p-2 rounded-lg mt-1">
                        <Globe className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <h4 className="font-sahel font-bold text-gray-800">آموزش و راهنمایی</h4>
                        <p className="font-dana text-sm text-gray-600">آموزش نحوه استفاده بهینه از تمامی قابلیت‌های سیستم</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-secondary/5 to-white">
                  <CardHeader>
                    <CardTitle className="font-shabnam text-xl text-secondary">سوالات متداول</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <details className="group">
                      <summary className="font-sahel font-bold text-gray-800 cursor-pointer">
                        چگونه می‌توانم حساب کاربری ایجاد کنم؟
                      </summary>
                      <p className="font-dana text-sm text-gray-600 mt-2 pr-4">
                        برای ایجاد حساب کاربری، روی دکمه "ورود به سیستم" کلیک کرده و مراحل ثبت‌نام را دنبال کنید.
                      </p>
                    </details>

                    <details className="group">
                      <summary className="font-sahel font-bold text-gray-800 cursor-pointer">
                        آیا سیستم برای موبایل طراحی شده؟
                      </summary>
                      <p className="font-dana text-sm text-gray-600 mt-2 pr-4">
                        بله، سیستم دفتر رابط کاملاً واکنشگرا (Responsive) طراحی شده و بر روی همه دستگاه‌ها عملکرد مناسبی دارد.
                      </p>
                    </details>

                    <details className="group">
                      <summary className="font-sahel font-bold text-gray-800 cursor-pointer">
                        هزینه استفاده از سیستم چقدر است؟
                      </summary>
                      <p className="font-dana text-sm text-gray-600 mt-2 pr-4">
                        برای اطلاع از تعرفه‌ها و بسته‌های مختلف، لطفاً با تیم فروش ما تماس بگیرید.
                      </p>
                    </details>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-shabnam font-bold text-primary mb-4">
                مکان ما
              </h3>
              <p className="text-lg font-dana text-gray-600">
                برای ملاقات حضوری، آدرس دفتر مرکزی ما
              </p>
            </div>

            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                    <h4 className="font-shabnam text-xl font-bold text-primary mb-6">آدرس دفتر مرکزی</h4>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-primary mt-1" />
                        <div>
                          <p className="font-dana text-gray-700">
                            تهران، خیابان ولیعصر، نرسیده به چهارراه ولیعصر، 
                            ساختمان دفتر رابط، طبقه ۳
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-secondary" />
                        <p className="font-dana text-gray-700">۰۲۱-۱۲۳۴۵۶۷۸</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-accent" />
                        <p className="font-dana text-gray-700">info@daftar-rabet.ir</p>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-white/50 rounded-lg">
                      <h5 className="font-sahel font-bold text-gray-800 mb-2">نکات مهم:</h5>
                      <ul className="font-dana text-sm text-gray-600 space-y-1">
                        <li>• پارکینگ رایگان در دسترس است</li>
                        <li>• دسترسی آسان با مترو و اتوبوس</li>
                        <li>• ملاقات با هماهنگی قبلی</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-gray-200 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-500">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <p className="font-dana">نقشه تعاملی</p>
                      <p className="font-dana text-sm">(در نسخه کامل قرار خواهد گرفت)</p>
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