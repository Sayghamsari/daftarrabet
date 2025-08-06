import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  BookOpen, 
  Calendar, 
  Clock, 
  User, 
  Plus,
  FileText,
  CheckCircle2,
  AlertCircle,
  Upload
} from "lucide-react";
import LoadingSpinner from "@/components/common/loading-spinner";

export default function Assignments() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    subject: ""
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "غیر مجاز",
        description: "شما از سیستم خارج شده‌اید. در حال ورود مجدد...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/auth";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  // Mock data - در آینده از API واقعی دریافت خواهد شد
  const mockAssignments = [
    {
      id: 1,
      title: "تکلیف ریاضی - فصل 3",
      description: "حل مسائل صفحه 45 تا 50 کتاب ریاضی",
      subject: "ریاضی",
      dueDate: "2024-08-15",
      status: "pending",
      teacherName: "فاطمه کریمی",
      submittedAt: null
    },
    {
      id: 2,
      title: "تحقیق فیزیک - نور",
      description: "تحقیق در مورد خواص نور و کاربردهای آن",
      subject: "فیزیک",
      dueDate: "2024-08-20",
      status: "submitted",
      teacherName: "محمد رضایی",
      submittedAt: "2024-08-10"
    },
    {
      id: 3,
      title: "انشا فارسی",
      description: "نوشتن انشایی با موضوع 'زیبایی های طبیعت ایران'",
      subject: "فارسی",
      dueDate: "2024-08-12",
      status: "overdue",
      teacherName: "زهرا احمدی",
      submittedAt: null
    }
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "در انتظار", variant: "outline" as const, color: "text-yellow-600" },
      submitted: { label: "ارسال شده", variant: "default" as const, color: "text-green-600" },
      overdue: { label: "گذشته از موعد", variant: "destructive" as const, color: "text-red-600" }
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const handleCreateAssignment = () => {
    // در آینده با API واقعی
    toast({
      title: "تکلیف ایجاد شد",
      description: "تکلیف جدید با موفقیت ایجاد شد",
    });
    setIsCreateDialogOpen(false);
    setNewAssignment({ title: "", description: "", dueDate: "", subject: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  تکالیف
                </h1>
                <p className="text-gray-600">
                  مدیریت و مشاهده تکالیف درسی
                </p>
              </div>
              {(user?.role === 'teacher' || user?.role === 'principal') && (
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus className="w-4 h-4" />
                      ایجاد تکلیف جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>ایجاد تکلیف جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">عنوان تکلیف</Label>
                        <Input
                          id="title"
                          value={newAssignment.title}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                          placeholder="عنوان تکلیف را وارد کنید"
                        />
                      </div>
                      <div>
                        <Label htmlFor="subject">درس</Label>
                        <Input
                          id="subject"
                          value={newAssignment.subject}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, subject: e.target.value }))}
                          placeholder="نام درس"
                        />
                      </div>
                      <div>
                        <Label htmlFor="dueDate">مهلت تحویل</Label>
                        <Input
                          id="dueDate"
                          type="date"
                          value={newAssignment.dueDate}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">توضیحات</Label>
                        <Textarea
                          id="description"
                          value={newAssignment.description}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="توضیحات تکلیف"
                          rows={3}
                        />
                      </div>
                      <Button onClick={handleCreateAssignment} className="w-full">
                        ایجاد تکلیف
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>

            {/* Stats Cards */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">کل تکالیف</p>
                      <p className="text-2xl font-bold text-blue-600">{mockAssignments.length}</p>
                    </div>
                    <BookOpen className="w-8 h-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">در انتظار</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {mockAssignments.filter(a => a.status === 'pending').length}
                      </p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">ارسال شده</p>
                      <p className="text-2xl font-bold text-green-600">
                        {mockAssignments.filter(a => a.status === 'submitted').length}
                      </p>
                    </div>
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">دیرکرد</p>
                      <p className="text-2xl font-bold text-red-600">
                        {mockAssignments.filter(a => a.status === 'overdue').length}
                      </p>
                    </div>
                    <AlertCircle className="w-8 h-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Assignments List */}
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList>
                <TabsTrigger value="all">همه تکالیف</TabsTrigger>
                <TabsTrigger value="pending">در انتظار</TabsTrigger>
                <TabsTrigger value="submitted">ارسال شده</TabsTrigger>
                <TabsTrigger value="overdue">دیرکرد</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {mockAssignments.map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {assignment.subject}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {assignment.teacherName}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                            </div>
                            {assignment.submittedAt && (
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className="w-4 h-4" />
                                ارسال: {new Date(assignment.submittedAt).toLocaleDateString('fa-IR')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {assignment.status === 'pending' && user?.role === 'student' && (
                            <Button size="sm" className="gap-2">
                              <Upload className="w-4 h-4" />
                              ارسال تکلیف
                            </Button>
                          )}
                          <Button variant="outline" size="sm" className="gap-2">
                            <FileText className="w-4 h-4" />
                            جزئیات
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="pending" className="space-y-4">
                {mockAssignments.filter(a => a.status === 'pending').map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {assignment.subject}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              مهلت: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="gap-2">
                          <Upload className="w-4 h-4" />
                          ارسال تکلیف
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="submitted" className="space-y-4">
                {mockAssignments.filter(a => a.status === 'submitted').map((assignment) => (
                  <Card key={assignment.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold">{assignment.title}</h3>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {assignment.subject}
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              ارسال: {assignment.submittedAt && new Date(assignment.submittedAt).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-2">
                          <FileText className="w-4 h-4" />
                          مشاهده ارسالی
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="overdue" className="space-y-4">
                {mockAssignments.filter(a => a.status === 'overdue').map((assignment) => (
                  <Card key={assignment.id} className="border-red-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-red-700">{assignment.title}</h3>
                            {getStatusBadge(assignment.status)}
                          </div>
                          <p className="text-gray-600 mb-3">{assignment.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {assignment.subject}
                            </div>
                            <div className="flex items-center gap-1 text-red-600">
                              <Calendar className="w-4 h-4" />
                              مهلت گذشته: {new Date(assignment.dueDate).toLocaleDateString('fa-IR')}
                            </div>
                          </div>
                        </div>
                        <Button size="sm" variant="destructive" className="gap-2">
                          <Upload className="w-4 h-4" />
                          ارسال دیرهنگام
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}