import emailjs from '@emailjs/browser';

// EmailJS Configuration - User needs to set these up at https://www.emailjs.com/
// Service ID: Create an email service in EmailJS dashboard
// Template IDs: Create templates for event registration, delegate pass, and concert booking
export const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_wtt60xf',
  EVENT_TEMPLATE_ID: 'template_0uzpwjc',
  DELEGATE_TEMPLATE_ID: 'template_kh3a565',
  CONCERT_TEMPLATE_ID: 'template_concert', // Create this template in EmailJS
  PUBLIC_KEY: 'acbz69d146b3J-jEm',
};

// Category to email mapping
const CATEGORY_EMAIL_MAP: Record<string, string> = {
  // Culturals and Fine Arts
  'culturals': 'Adwaitaigmcri@gmail.com',
  'fine-arts': 'Adwaitaigmcri@gmail.com',
  'finearts': 'Adwaitaigmcri@gmail.com',
  
  // Sports, Literature and Debate
  'sports': 'Ignitusigmc@gmail.com',
  'literature': 'Ignitusigmc@gmail.com',
  'debate': 'Ignitusigmc@gmail.com',
  
  // Academic, Designing, Photography and Other
  'academic': 'Finance.igmcrisigma@gmail.com',
  'graphix': 'Finance.igmcrisigma@gmail.com',
  'designing': 'Finance.igmcrisigma@gmail.com',
  'photography': 'Finance.igmcrisigma@gmail.com',
  'technical': 'Finance.igmcrisigma@gmail.com',
  'other': 'Finance.igmcrisigma@gmail.com',
};

// Default email for categories not in the map
const DEFAULT_EMAIL = 'Finance.igmcrisigma@gmail.com';

// Get recipient email based on category
export const getRecipientEmail = (categoryName: string): string => {
  const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_EMAIL_MAP[normalizedCategory] || DEFAULT_EMAIL;
};

// Team member interface
interface TeamMember {
  name: string;
  phone?: string;
  year?: string;
}

// Event registration email parameters
interface EventEmailParams {
  registrationId: string;
  eventName: string;
  categoryName: string;
  captainName: string;
  captainPhone: string;
  captainYear?: string;
  email: string;
  institution: string;
  teamMembers: TeamMember[];
  feeAmount: number;
  delegateId?: string;
  couponCode?: string;
  participantCategory?: string;
  paymentScreenshotUrl?: string;
}

// Delegate pass email parameters
interface DelegateEmailParams {
  delegateId: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  tierName: string;
  tierPrice: number;
}

// Concert booking email parameters
interface ConcertEmailParams {
  bookingId: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  ticketType: string;
  ticketPrice: number;
  partnerName?: string;
  partnerPhone?: string;
}

// Format team members for email
const formatTeamMembers = (members: TeamMember[]): string => {
  if (members.length <= 1) return 'Individual participation';
  
  return members.map((member, index) => {
    if (index === 0) {
      return `Captain: ${member.name} (${member.phone || 'N/A'}) - ${member.year || 'N/A'}`;
    }
    return `Member ${index + 1}: ${member.name}${member.phone ? ` (${member.phone})` : ''}${member.year ? ` - ${member.year}` : ''}`;
  }).join('\n');
};

// Send event registration confirmation email
export const sendEventRegistrationEmail = async (params: EventEmailParams): Promise<boolean> => {
  try {
    const recipientEmail = getRecipientEmail(params.categoryName);
    
    const templateParams = {
      to_email: recipientEmail,
      registration_id: params.registrationId,
      event_name: params.eventName,
      category_name: params.categoryName,
      captain_name: params.captainName,
      captain_phone: params.captainPhone,
      captain_year: params.captainYear || 'Not specified',
      participant_email: params.email,
      institution: params.institution,
      team_members: formatTeamMembers(params.teamMembers),
      team_size: params.teamMembers.length,
      fee_amount: `₹${params.feeAmount}`,
      delegate_id: params.delegateId || 'Not provided',
      coupon_code: params.couponCode || 'Not used',
      participant_category: params.participantCategory || 'Not specified',
      registration_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
      payment_screenshot_url: params.paymentScreenshotUrl || '',
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.EVENT_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Event registration email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send event registration email:', error);
    return false;
  }
};

// Send delegate pass confirmation email
export const sendDelegatePassEmail = async (params: DelegateEmailParams): Promise<boolean> => {
  try {
    // Delegate pass emails go to Finance email
    const recipientEmail = 'Finance.igmcrisigma@gmail.com';
    
    const templateParams = {
      to_email: recipientEmail,
      delegate_id: params.delegateId,
      delegate_name: params.name,
      delegate_email: params.email,
      delegate_phone: params.phone,
      institution: params.institution,
      tier_name: params.tierName,
      tier_price: `₹${params.tierPrice}`,
      registration_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.DELEGATE_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Delegate pass email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send delegate pass email:', error);
    return false;
  }
};

// Send concert booking confirmation email
export const sendConcertBookingEmail = async (params: ConcertEmailParams): Promise<boolean> => {
  try {
    // Concert booking emails go to Finance email
    const recipientEmail = 'Finance.igmcrisigma@gmail.com';
    
    const templateParams = {
      to_email: recipientEmail,
      booking_id: params.bookingId,
      name: params.name,
      email: params.email,
      phone: params.phone,
      institution: params.institution,
      ticket_type: params.ticketType,
      ticket_price: `₹${params.ticketPrice}`,
      partner_name: params.partnerName || 'N/A (Stag Entry)',
      partner_phone: params.partnerPhone || 'N/A',
      booking_date: new Date().toLocaleString('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
        timeZone: 'Asia/Kolkata'
      }),
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.CONCERT_TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );

    console.log('Concert booking email sent successfully:', response);
    return true;
  } catch (error) {
    console.error('Failed to send concert booking email:', error);
    return false;
  }
};
