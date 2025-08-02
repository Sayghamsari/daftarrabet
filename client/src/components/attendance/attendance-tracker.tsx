import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingSpinner from "@/components/common/loading-spinner";
import EmptyState from "@/components/common/empty-state";
import { 
  UserCheck, 
  Users, 
  Calendar,
  Clock,
  CheckCircle,
  X,
  AlertTriangle,
  MessageSquare,
  Save
} from "lucide-react";

interface AttendanceTrackerProps {
  classes: any[];
  selectedDate: Date;
  onRecordAttendance: (record: any) => void;
  isLoading?: boolean;
}

export default function AttendanceTracker({
  classes,
  selectedDate,
  onRecordAttendance,
  isLoading = false
}: AttendanceTrackerProps) {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, any>>({});
  const [bulkAction, setBulkAction] = useState("");

  // Mock students data - in real app this would come from API
  const mockStudents = [
    { id: "1", firstName: "علی", lastName: "احمدی", studentNumber: "12345" },
    { id: "2", firstName: "فاطمه", lastName: "محمدی", studentNumber: "12346" },
    { id: "3", firstName: "حسین", lastName: "رضایی", studentNumber: "12347" },
    { id: "4", firstName: "مریم", lastName: "کریمی", studentNumber: "12348" },
    { id: "5", firstName: "مجید", lastName: "نوری", studentNumber: "12349" },
  ];

  const attendanceStatuses = [
    { value: "present", label: "حاضر", color: "bg-green-100 text-green-800" },
    { value: "absent", label: "غایب", color: "bg-red-100 text-red-800" },
    { value: "late", label: "تأخیر", color: "bg-yellow-100 text-yellow-800" },
    { value: "excused", label: "موجه", color: "bg-blue-100 text-blue-800" },
  ];

  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
        entryTime: status === 'present' || status === 'late' ? new Date() : null,
        exitTime: null,
      }
    }));
  };

  const handleNotesChange = (studentId: string, notes: string) => {
    setAttendanceRecords(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      }
    }));
  };

  const handleBulkAction = () => {
    if (!bulkAction || !selectedClass) return;

    const updates: Record<string, any> = {};
    mockStudents.forEach(student => {
      if (!attendanceRecords[student.id]?.status) {
        updates[student.id] = {
          status: bulkAction,
          entryTime: bulkAction === 'present' ? new Date() : null,
          exitTime: null,
        };
      }
    });

    setAttendanceRecords(prev => ({ ...prev, ...updates }));
    setBulkAction("");
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) return;

    const records = Object.entries(attendanceRecords).map(([studentId, record]) => ({
      studentId,
      classId: selectedClass.id,
      date: selectedDate.toISOString().split('T')[0],
      status: record.status || 'absent',
      entryTime: record.entryTime,
      exitTime: record.exitTime,
      notes: record.notes || null,
    }));

    records.forEach(record => {
      onRecordAttendance(record);
    });

    setAttendanceRecords({});
  };

  const getStatusColor = (status: string) => {
    const statusObj = attendanceStatuses.find(s => s.value === status);
    return statusObj?.color || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const statusObj = attendanceStatuses.find(s => s.value === status);
    return statusObj?.label || status;
  };

  const calculateStats = () => {
    const records = Object.values(attendanceRecords);
    const total = mockStudents.length;
    const recorded = records.length;
    const present = records.filter((r: any) => r.status === 'present').length;
    const absent = records.filter((r: any) => r.status === 'absent').length;
    const late = records.filter((r: any) => r.status === 'late').length;
    const excused = records.filter((r: any) => r.status === 'excused').length;

    return { total, recorded, present, absent, late, excused };
  };

  const stats = calculateStats();

  return (
    <div className="space-y-6">
      {/* Class Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            انتخاب کلاس برای ثبت حضور
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label htmlFor="class-select">کلاس</Label>
              <Select onValueChange={(value) => {
                const cls = classes.find(c => c.id === value);
                setSelectedClass(cls);
                setAttendanceRecords({});
              }}>
                <SelectTrigger id="class-select">
                  <SelectValue placeholder="کلاس را انتخاب کنید" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name} - {cls.subject} (پایه {cls.grade})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>تاریخ انتخاب شده</Label>
              <div className="flex items-center gap-2 h-10 px-3 bg-gray-50 rounded border">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">
                  {selectedDate.toLocaleDateString('fa-IR')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedClass ? (
        <>
          {/* Stats and Bulk Actions */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">آمار حضور</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.present}</p>
                    <p className="text-sm text-gray-600">حاضر</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-600">{stats.absent + (stats.total - stats.recorded)}</p>
                    <p className="text-sm text-gray-600">غایب</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-600">{stats.late}</p>
                    <p className="text-sm text-gray-600">تأخیر</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.excused}</p>
                    <p className="text-sm text-gray-600">موجه</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">عملیات گروهی</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>وضعیت برای همه دانش‌آموزان بدون ثبت</Label>
                    <div className="flex gap-2">
                      <Select value={bulkAction} onValueChange={setBulkAction}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="وضعیت را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {attendanceStatuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button onClick={handleBulkAction} disabled={!bulkAction}>
                        اعمال
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={handleSaveAttendance}
                    disabled={isLoading || Object.keys(attendanceRecords).length === 0}
                    className="w-full"
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Save className="w-4 h-4 ml-2" />
                        ذخیره حضور و غیاب
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Attendance List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5" />
                  لیست دانش‌آموزان - {selectedClass.name}
                </span>
                <Badge variant="outline">
                  {mockStudents.length} دانش‌آموز
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockStudents.map((student) => {
                  const record = attendanceRecords[student.id];
                  return (
                    <div key={student.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="grid md:grid-cols-4 gap-4 items-start">
                        {/* Student Info */}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            شماره دانش‌آموزی: {student.studentNumber}
                          </p>
                          {record?.entryTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              <Clock className="w-3 h-3 inline ml-1" />
                              ورود: {new Date(record.entryTime).toLocaleTimeString('fa-IR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>

                        {/* Status Selection */}
                        <div>
                          <Label className="text-sm">وضعیت حضور</Label>
                          <Select 
                            value={record?.status || ""} 
                            onValueChange={(value) => handleStatusChange(student.id, value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent>
                              {attendanceStatuses.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${status.color.split(' ')[0]}`}></div>
                                    {status.label}
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Notes */}
                        <div>
                          <Label className="text-sm">یادداشت</Label>
                          <Input
                            placeholder="یادداشت..."
                            value={record?.notes || ""}
                            onChange={(e) => handleNotesChange(student.id, e.target.value)}
                            className="text-sm"
                          />
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center justify-end">
                          {record?.status ? (
                            <Badge className={getStatusColor(record.status)}>
                              {record.status === 'present' && <CheckCircle className="w-3 h-3 ml-1" />}
                              {record.status === 'absent' && <X className="w-3 h-3 ml-1" />}
                              {record.status === 'late' && <AlertTriangle className="w-3 h-3 ml-1" />}
                              {record.status === 'excused' && <MessageSquare className="w-3 h-3 ml-1" />}
                              {getStatusLabel(record.status)}
                            </Badge>
                          ) : (
                            <Badge variant="outline">
                              ثبت نشده
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <EmptyState
          title="کلاسی انتخاب نشده"
          description="برای شروع ثبت حضور و غیاب، ابتدا کلاس مورد نظر را انتخاب کنید"
          icon={<Users className="w-12 h-12" />}
        />
      )}
    </div>
  );
}
