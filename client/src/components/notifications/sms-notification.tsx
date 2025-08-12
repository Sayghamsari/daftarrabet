import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Clock, CheckCircle, XCircle, Phone, Send } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SMSNotification {
  id: string;
  studentId: string;
  studentName: string;
  parentPhone: string;
  type: "attendance" | "grade" | "behavior" | "general";
  status: "pending" | "sent" | "delivered" | "failed";
  message: string;
  sentAt?: string;
  deliveredAt?: string;
  createdAt: string;
}

interface AttendanceEvent {
  studentId: string;
  studentName: string;
  parentPhone: string;
  status: "late" | "absent";
  date: string;
  className: string;
}

export function SMSNotificationSystem() {
  const [notifications, setNotifications] = useState<SMSNotification[]>([]);
  const [pendingCount, setPendingCount] = useState(0);
  const { toast } = useToast();

  // Fetch SMS notifications
  const { data: smsData, refetch } = useQuery({
    queryKey: ['/api/sms-notifications'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sms-notifications");
      return response.json();
    }
  });

  // Send SMS mutation
  const sendSMSMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      const response = await apiRequest("POST", `/api/sms-notifications/${notificationId}/send`);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "موفقیت",
        description: "پیامک با موفقیت ارسال شد",
        variant: "default"
      });
      refetch();
    },
    onError: (error: Error) => {
      toast({
        title: "خطا",
        description: error.message || "خطا در ارسال پیامک",
        variant: "destructive"
      });
    }
  });

  // Auto-generate SMS notifications for attendance events
  const generateAttendanceSMS = (event: AttendanceEvent) => {
    const messages = {
      late: `عزیز والدین، فرزند شما ${event.studentName} در تاریخ ${event.date} با تأخیر به کلاس ${event.className} حاضر شده است. دفتر رابط مدرسه`,
      absent: `عزیز والدین، فرزند شما ${event.studentName} در تاریخ ${event.date} در کلاس ${event.className} غایب بوده است. دفتر رابط مدرسه`
    };

    const newNotification: SMSNotification = {
      id: `sms-${Date.now()}`,
      studentId: event.studentId,
      studentName: event.studentName,
      parentPhone: event.parentPhone,
      type: "attendance",
      status: "pending",
      message: messages[event.status],
      createdAt: new Date().toISOString()
    };

    setNotifications(prev => [newNotification, ...prev]);
    setPendingCount(prev => prev + 1);
  };

  // Simulate attendance events (در پروژه واقعی از WebSocket یا polling استفاده می‌شود)
  useEffect(() => {
    const mockAttendanceEvents: AttendanceEvent[] = [
      {
        studentId: "student1",
        studentName: "علی احمدی",
        parentPhone: "09123456789",
        status: "late",
        date: new Date().toLocaleDateString('fa-IR'),
        className: "ریاضی پایه نهم"
      }
    ];

    // Simulate real-time attendance updates
    const timer = setTimeout(() => {
      mockAttendanceEvents.forEach(generateAttendanceSMS);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { variant: "secondary" as const, label: "در انتظار", icon: Clock },
      sent: { variant: "default" as const, label: "ارسال شده", icon: Send },
      delivered: { variant: "default" as const, label: "تحویل داده شده", icon: CheckCircle },
      failed: { variant: "destructive" as const, label: "ناموفق", icon: XCircle }
    };
    const config = statusMap[status as keyof typeof statusMap];
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="font-vazir">
        <Icon className="w-3 h-3 ml-1" />
        {config.label}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap = {
      attendance: "حضور و غیاب",
      grade: "نمرات",
      behavior: "انضباط",
      general: "عمومی"
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  const handleSendSMS = (notificationId: string) => {
    sendSMSMutation.mutate(notificationId);
    
    // Update local state optimistically
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, status: "sent" as const, sentAt: new Date().toISOString() }
          : notif
      )
    );
    setPendingCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="space-y-6">
      {/* Header with stats */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-shabnam font-bold">سیستم پیامک هوشمند</h2>
          {pendingCount > 0 && (
            <Badge variant="destructive" className="font-vazir">
              {pendingCount} پیامک در انتظار
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span className="font-vazir">ارسال خودکار فعال</span>
        </div>
      </div>

      {/* Auto-send toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="font-shabnam text-lg">تنظیمات ارسال خودکار</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-vazir text-sm">حضور و غیاب</span>
              <Badge variant="default" className="font-vazir">فعال</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-vazir text-sm">اعلام نمرات</span>
              <Badge variant="default" className="font-vazir">فعال</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-vazir text-sm">موارد انضباطی</span>
              <Badge variant="default" className="font-vazir">فعال</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="font-vazir text-sm">اطلاعیه‌ها</span>
              <Badge variant="secondary" className="font-vazir">غیرفعال</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications list */}
      <div className="space-y-4">
        <h3 className="text-lg font-shabnam font-semibold">تاریخچه پیامک‌ها</h3>
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-vazir">هنوز پیامکی ارسال نشده است</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-vazir font-semibold">{notification.studentName}</h4>
                      <Badge variant="outline" className="font-vazir text-xs">
                        {getTypeLabel(notification.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground font-vazir">
                      شماره والدین: {notification.parentPhone}
                    </p>
                  </div>
                  {getStatusBadge(notification.status)}
                </div>
                
                <div className="bg-muted p-3 rounded-lg mb-4">
                  <p className="text-sm font-vazir">{notification.message}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-xs text-muted-foreground font-vazir">
                    ایجاد شده: {new Date(notification.createdAt).toLocaleString('fa-IR')}
                    {notification.sentAt && (
                      <span className="mr-4">
                        ارسال شده: {new Date(notification.sentAt).toLocaleString('fa-IR')}
                      </span>
                    )}
                  </div>
                  
                  {notification.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => handleSendSMS(notification.id)}
                      disabled={sendSMSMutation.isPending}
                      className="font-vazir"
                    >
                      <Send className="w-4 h-4 ml-1" />
                      ارسال پیامک
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

// Hook for triggering SMS notifications from other components
export function useAttendanceSMS() {
  const triggerAttendanceSMS = (attendanceData: {
    studentId: string;
    studentName: string; 
    parentPhone: string;
    status: "late" | "absent";
    className: string;
  }) => {
    // This would typically make an API call to trigger SMS
    console.log("Triggering attendance SMS for:", attendanceData);
  };

  return { triggerAttendanceSMS };
}