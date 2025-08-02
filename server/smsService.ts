// SMS service for verification codes

export interface SmsConfig {
  apiKey: string;
  apiUrl: string;
  username?: string;
  password?: string;
}

export class SmsService {
  private config: SmsConfig;

  constructor() {
    this.config = {
      apiKey: process.env.SMS_API_KEY || '',
      apiUrl: process.env.SMS_API_URL || '',
      username: process.env.SMS_USERNAME || '',
      password: process.env.SMS_PASSWORD || ''
    };
  }

  async sendVerificationCode(phoneNumber: string, code: string): Promise<boolean> {
    try {
      // اگر در محیط توسعه هستیم، کد را در console چاپ کنیم
      if (process.env.NODE_ENV === 'development') {
        console.log(`🔐 کد تایید برای ${phoneNumber}: ${code}`);
        return true;
      }

      // ارسال پیامک واقعی از طریق API
      const message = `کد تایید دفتر رابط: ${code}`;
      
      // Use native fetch (available in Node.js 18+)
      const response = await globalThis.fetch(this.config.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        body: JSON.stringify({
          to: phoneNumber,
          message: message,
          username: this.config.username,
          password: this.config.password
        })
      });

      if (!response.ok) {
        throw new Error(`SMS API Error: ${response.status}`);
      }

      const result = await response.json();
      return result.success || result.status === 'sent';
    } catch (error) {
      console.error('Error sending SMS:', error);
      return false;
    }
  }

  generateVerificationCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  isValidPhoneNumber(phoneNumber: string): boolean {
    // بررسی فرمت شماره تلفن ایرانی
    const phoneRegex = /^09\d{9}$/;
    return phoneRegex.test(phoneNumber);
  }

  isValidNationalId(nationalId: string): boolean {
    // بررسی صحت کد ملی ایرانی
    if (!/^\d{10}$/.test(nationalId)) return false;
    
    const check = parseInt(nationalId.charAt(9));
    let sum = 0;
    
    for (let i = 0; i < 9; i++) {
      sum += parseInt(nationalId.charAt(i)) * (10 - i);
    }
    
    const remainder = sum % 11;
    
    return (remainder < 2 && check === remainder) || (remainder >= 2 && check === 11 - remainder);
  }
}

export const smsService = new SmsService();