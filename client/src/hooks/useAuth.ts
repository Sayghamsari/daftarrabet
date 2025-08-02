import { createContext, ReactNode, useContext } from "react";
import { useQuery, useMutation, UseMutationResult } from "@tanstack/react-query";
import { User, LoginData, RegisterData, VerifyPhoneData, CompleteProfileData } from "@shared/schema";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  isAuthenticated: boolean;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  sendVerificationMutation: UseMutationResult<{ success: boolean }, Error, RegisterData>;
  verifyPhoneMutation: UseMutationResult<{ success: boolean }, Error, VerifyPhoneData>;
  completeProfileMutation: UseMutationResult<{ user: User }, Error, CompleteProfileData>;
}

export const AuthContext = createContext<AuthContextData | null>(null);

export function AuthProvider(props: { children: ReactNode }) {
  const { toast } = useToast();
  
  const { data: user, error, isLoading } = useQuery<User | undefined, Error>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return await res.json();
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/auth/user"], user);
      toast({ title: "ورود موفق", description: "خوش آمدید" });
    },
    onError: (error: Error) => {
      toast({ title: "خطا در ورود", description: error.message, variant: "destructive" });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/auth/user"], null);
      toast({ title: "خروج موفق", description: "با موفقیت خارج شدید" });
    },
    onError: (error: Error) => {
      toast({ title: "خطا در خروج", description: error.message, variant: "destructive" });
    },
  });

  const sendVerificationMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const res = await apiRequest("POST", "/api/auth/send-verification", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "کد ارسال شد", description: "کد تایید به شماره تلفن شما ارسال شد" });
    },
    onError: (error: Error) => {
      toast({ title: "خطا در ارسال کد", description: error.message, variant: "destructive" });
    },
  });

  const verifyPhoneMutation = useMutation({
    mutationFn: async (data: VerifyPhoneData) => {
      const res = await apiRequest("POST", "/api/auth/verify-phone", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "تایید موفق", description: "شماره تلفن با موفقیت تایید شد" });
    },
    onError: (error: Error) => {
      toast({ title: "خطا در تایید", description: error.message, variant: "destructive" });
    },
  });

  const completeProfileMutation = useMutation({
    mutationFn: async (data: CompleteProfileData) => {
      const res = await apiRequest("POST", "/api/auth/complete-profile", data);
      return await res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/auth/user"], data.user);
      toast({ title: "ثبت‌نام موفق", description: "حساب کاربری شما با موفقیت ایجاد شد" });
    },
    onError: (error: Error) => {
      toast({ title: "خطا در ثبت‌نام", description: error.message, variant: "destructive" });
    },
  });

  const authData: AuthContextData = {
    user: user || null,
    isLoading,
    error,
    isAuthenticated: Boolean(user),
    loginMutation,
    logoutMutation,
    sendVerificationMutation,
    verifyPhoneMutation,
    completeProfileMutation,
  };

  return AuthContext.Provider({ value: authData, children: props.children });
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}