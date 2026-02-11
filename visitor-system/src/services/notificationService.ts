import type { Invitation } from '../types';

export interface NotificationSettings {
  email: boolean;
  sms: boolean;
  checkInNotification: boolean;
  reminderNotification: boolean;
}

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SMSTemplate {
  message: string;
}

class NotificationService {
  private static instance: NotificationService;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Email Templates
  private emailTemplates: Record<string, EmailTemplate> = {
    invitation: {
      subject: 'دعوة زيارة - {visitorName}',
      body: `
السلام عليكم {visitorName},

يسرنا دعوتك لزيارة {companyName} في التاريخ {visitDate} الساعة {visitTime}.

تفاصيل الزيارة:
- الاسم: {visitorName}
- المسمى الوظيفي: {visitorTitle}
- تاريخ الزيارة: {visitDate}
- وقت الزيارة: {visitTime}
- الطابق: {floorNumber}
- المكتب: {officeNumber}
- الإدارة: {directorate}
- سبب الزيارة: {reasonForVisit}

يرجى إحضار رمز QR المرفق لتسهيل عملية تسجيل الدخول.

مع أطيب التحيات،
فريق الاستقبال
{companyName}
      `
    },
    checkIn: {
      subject: 'تم تسجيل دخولك - {visitorName}',
      body: `
عزيزي {visitorName},

نؤكد لك أنه تم تسجيل دخولك بنجاح في {companyName} بتاريخ {checkInDate} الساعة {checkInTime}.

نشكرك على تعاونك، ونتمنى لك زيارة موفقة.

مع أطيب التحيات،
{companyName}
      `
    },
    reminder: {
      subject: 'تذكير بالدعوة - {visitorName}',
      body: `
عزيزي {visitorName},

هذا تذكير بدعوتك لزيارة {companyName} غداً {visitDate} الساعة {visitTime}.

يرجى عدم نسيان إحضار رمز QR لتسهيل عملية تسجيل الدخول.

نتطلع لرؤيتك!

مع أطيب التحيات،
{companyName}
      `
    }
  };

  // SMS Templates
  private smsTemplates: Record<string, SMSTemplate> = {
    invitation: {
      message: '{companyName}: دعوة زيارة {visitDate} {visitTime}. رمز: {qrCode}'
    },
    checkIn: {
      message: '{companyName}: شكراً لتسجيل دخولك {visitorName} في {checkInTime}'
    },
    reminder: {
      message: '{companyName}: تذكير دعوة غداً {visitDate} {visitTime}'
    }
  };

  // Send Email
  public async sendEmail(
    to: string, 
    templateKey: keyof typeof this.emailTemplates, 
    data: Record<string, string>
  ): Promise<boolean> {
    try {
      const template = this.emailTemplates[templateKey];
      const emailBody = this.populateTemplate(template.body, data);
      const emailSubject = this.populateTemplate(template.subject, data);

      // In a real implementation, you would use an email service like:
      // - SendGrid, AWS SES, Mailgun, etc.
      // - For demo purposes, we'll simulate the email send
      
      console.log('📧 Sending Email:', {
        to,
        subject: emailSubject,
        body: emailBody
      });

      // Simulate email send delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  }

  // Send SMS
  public async sendSMS(
    to: string,
    templateKey: keyof typeof this.smsTemplates,
    data: Record<string, string>
  ): Promise<boolean> {
    try {
      const template = this.smsTemplates[templateKey];
      const message = this.populateTemplate(template.message, data);

      // In a real implementation, you would use an SMS service like:
      // - Twilio, AWS SNS, Vonage, etc.
      // - For demo purposes, we'll simulate the SMS send
      
      console.log('📱 Sending SMS:', {
        to,
        message
      });

      // Simulate SMS send delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return true;
    } catch (error) {
      console.error('Failed to send SMS:', error);
      return false;
    }
  }

  // Send invitation notification
  public async sendInvitationNotification(invitation: Invitation, visitorEmail?: string, visitorPhone?: string): Promise<void> {
    const data = {
      visitorName: invitation.visitorFullName,
      visitorTitle: invitation.visitorTitle,
      visitDate: invitation.visitDate,
      visitTime: invitation.visitTime,
      floorNumber: invitation.floorNumber.toString(),
      officeNumber: invitation.officeNumber,
      directorate: invitation.invitingDirectorate,
      reasonForVisit: invitation.reasonForVisit,
      companyName: 'شركة الزيارة',
      qrCode: invitation.id.slice(-6) // Last 6 digits as QR code
    };

    // Send email
    if (visitorEmail) {
      await this.sendEmail(visitorEmail, 'invitation', data);
    }
    
    // Send SMS (if phone number available)
    if (visitorPhone) {
      await this.sendSMS(visitorPhone, 'invitation', data);
    }
  }

  // Send check-in notification
  public async sendCheckInNotification(invitation: Invitation, visitorEmail?: string, visitorPhone?: string): Promise<void> {
    const data = {
      visitorName: invitation.visitorFullName,
      companyName: 'شركة الزيارة',
      checkInDate: new Date().toLocaleDateString('ar-SA'),
      checkInTime: new Date().toLocaleTimeString('ar-SA', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    if (visitorEmail) {
      await this.sendEmail(visitorEmail, 'checkIn', data);
    }
    
    if (visitorPhone) {
      await this.sendSMS(visitorPhone, 'checkIn', data);
    }
  }

  // Send reminder notification
  public async sendReminderNotification(invitation: Invitation, visitorEmail?: string, visitorPhone?: string): Promise<void> {
    const data = {
      visitorName: invitation.visitorFullName,
      visitDate: invitation.visitDate,
      visitTime: invitation.visitTime,
      companyName: 'شركة الزيارة'
    };

    if (visitorEmail) {
      await this.sendEmail(visitorEmail, 'reminder', data);
    }
    
    if (visitorPhone) {
      await this.sendSMS(visitorPhone, 'reminder', data);
    }
  }

  // Helper method to populate templates
  private populateTemplate(template: string, data: Record<string, string>): string {
    let result = template;
    Object.entries(data).forEach(([key, value]) => {
      result = result.replace(new RegExp(`\\$\\{${key}\\}`, 'g'), value);
    });
    return result;
  }

  // Validate email format
  public isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone format (Saudi numbers)
  public isValidPhone(phone: string): boolean {
    const phoneRegex = /^(\+966|0)?5[0-9]{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Get notification settings (would be stored in user preferences)
  public getNotificationSettings(): NotificationSettings {
    return {
      email: true,
      sms: true,
      checkInNotification: true,
      reminderNotification: true
    };
  }
}

export default NotificationService.getInstance();
