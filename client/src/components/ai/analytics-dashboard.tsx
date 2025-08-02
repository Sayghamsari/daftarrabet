import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  Brain,
  RefreshCw
} from "lucide-react";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/common/loading-spinner";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  id: string;
  entityType: string;
  entityId: string;
  analysisType: string;
  data: any;
  insights: any;
  generatedAt: string;
}

interface AnalyticsDashboardProps {
  entityType: string;
  entityId: string;
  className?: string;
}

export default function AnalyticsDashboard({ 
  entityType, 
  entityId, 
  className = "" 
}: AnalyticsDashboardProps) {
  const [selectedAnalysisType, setSelectedAnalysisType] = useState("performance");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/analytics", entityType, entityId, selectedAnalysisType],
    retry: false,
  });

  const generateAnalyticsMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/analytics/generate", {
        entityType,
        entityId,
        analysisType: selectedAnalysisType
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics", entityType, entityId] });
      toast({
        title: "موفق",
        description: "تحلیل‌های جدید با موفقیت تولید شد",
      });
    },
    onError: (error) => {
      toast({
        title: "خطا",
        description: "خطا در تولید تحلیل‌ها",
        variant: "destructive",
      });
    }
  });

  const analysisTypes = [
    { value: "performance", label: "عملکرد تحصیلی" },
    { value: "attendance", label: "حضور و غیاب" },
    { value: "behavior", label: "رفتاری" }
  ];

  const getInsightColor = (type: string) => {
    const colors = {
      positive: "text-green-600 bg-green-50 border-green-200",
      warning: "text-yellow-600 bg-yellow-50 border-yellow-200",
      negative: "text-red-600 bg-red-50 border-red-200",
      info: "text-blue-600 bg-blue-50 border-blue-200"
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getInsightIcon = (type: string) => {
    const icons = {
      positive: <CheckCircle className="w-4 h-4" />,
      warning: <AlertTriangle className="w-4 h-4" />,
      negative: <TrendingDown className="w-4 h-4" />,
      info: <TrendingUp className="w-4 h-4" />
    };
    return icons[type as keyof typeof icons] || icons.info;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">تحلیل‌های هوش مصنوعی</CardTitle>
              <Badge className="bg-primary/10 text-primary">AI</Badge>
            </div>
            <Button 
              onClick={() => generateAnalyticsMutation.mutate()}
              disabled={generateAnalyticsMutation.isPending}
              className="gap-2"
            >
              {generateAnalyticsMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              تولید تحلیل جدید
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {analysisTypes.map((type) => (
              <Button
                key={type.value}
                variant={selectedAnalysisType === type.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedAnalysisType(type.value)}
              >
                {type.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Content */}
      {isLoading ? (
        <Card>
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <LoadingSpinner />
            </div>
          </CardContent>
        </Card>
      ) : analytics && analytics.length > 0 ? (
        <div className="grid gap-6">
          {analytics.map((analytic: AnalyticsData) => (
            <Card key={analytic.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    نتایج تحلیل {analysisTypes.find(t => t.value === analytic.analysisType)?.label}
                  </CardTitle>
                  <Badge variant="outline" className="text-xs">
                    {new Date(analytic.generatedAt).toLocaleDateString('fa-IR')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Key Metrics */}
                {analytic.data && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {Object.entries(analytic.data).map(([key, value]: [string, any]) => (
                      <div key={key} className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-1">{key}</p>
                        <p className="text-lg font-semibold">{value?.toString()}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* AI Insights */}
                {analytic.insights && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800">بینش‌های هوش مصنوعی:</h4>
                    
                    {analytic.insights.general && (
                      <div className={`p-4 rounded-lg border ${getInsightColor('info')}`}>
                        <div className="flex items-start gap-2">
                          {getInsightIcon('info')}
                          <p className="text-sm">{analytic.insights.general}</p>
                        </div>
                      </div>
                    )}

                    {analytic.insights.recommendations && Array.isArray(analytic.insights.recommendations) && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">پیشنهادات:</h5>
                        <div className="space-y-2">
                          {analytic.insights.recommendations.map((rec: string, index: number) => (
                            <div key={index} className={`p-3 rounded-lg border ${getInsightColor('positive')}`}>
                              <div className="flex items-start gap-2">
                                {getInsightIcon('positive')}
                                <p className="text-sm">{rec}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {analytic.insights.alerts && Array.isArray(analytic.insights.alerts) && (
                      <div>
                        <h5 className="font-medium text-gray-700 mb-2">هشدارها:</h5>
                        <div className="space-y-2">
                          {analytic.insights.alerts.map((alert: string, index: number) => (
                            <div key={index} className={`p-3 rounded-lg border ${getInsightColor('warning')}`}>
                              <div className="flex items-start gap-2">
                                {getInsightIcon('warning')}
                                <p className="text-sm">{alert}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              هنوز تحلیلی تولید نشده
            </h3>
            <p className="text-gray-500 mb-4">
              برای دریافت تحلیل‌های هوشمند، روی دکمه "تولید تحلیل جدید" کلیک کنید
            </p>
            <Button 
              onClick={() => generateAnalyticsMutation.mutate()}
              disabled={generateAnalyticsMutation.isPending}
              className="gap-2"
            >
              {generateAnalyticsMutation.isPending ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Brain className="w-4 h-4" />
              )}
              تولید اولین تحلیل
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
