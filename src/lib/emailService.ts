import emailjs from '@emailjs/browser';

// EmailJS Configuration - Event/Delegate Registrations (Adwaita service)
const EMAILJS_PUBLIC_KEY = 'mw9M-R2Mvq5LzTBsG';
const EMAILJS_SERVICE_ID = 'service_t9xdm2r'; // Adwaita service
const EMAILJS_EVENT_TEMPLATE_ID = 'template_0hk3wmo';
const EMAILJS_DELEGATE_TEMPLATE_ID = 'template_0hk3wmo';

// EmailJS Configuration - Krishh Concert (Gmail service)
const EMAILJS_CONCERT_SERVICE_ID = 'service_8s3w4ew'; // Gmail service for Krishh
const EMAILJS_CONCERT_TEMPLATE_ID = 'template_dxzrdld';

// Category-based email mapping for CC/incharge notifications
const CATEGORY_EMAIL_MAP: Record<string, string> = {
  'culturals': 'Adwaitaigmcri@gmail.com',
  'finearts': 'Adwaitaigmcri@gmail.com',
  'sports': 'Ignitusigmc@gmail.com',
  'literature': 'Ignitusigmc@gmail.com',
  'literature-&-debate': 'Ignitusigmc@gmail.com',
  'literature-debate': 'Ignitusigmc@gmail.com',
  'academic': 'Finance.igmcrisigma@gmail.com',
  'technical': 'Finance.igmcrisigma@gmail.com',
  'photography': 'Finance.igmcrisigma@gmail.com',
  'ssc': 'Finance.igmcrisigma@gmail.com',
  'graphix': 'Finance.igmcrisigma@gmail.com',
  'other': 'Finance.igmcrisigma@gmail.com',
};

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

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
  payment_screenshot_url?: string;
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

// Helper function to get recipient email based on category
const getRecipientEmail = (categoryName: string): string => {
  const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_EMAIL_MAP[normalizedCategory] || 'Finance.igmcrisigma@gmail.com';
};

// Send event registration confirmation email directly via EmailJS
export const sendEventRegistrationEmail = async (params: EventEmailParams): Promise<boolean> => {
  try {
    const recipientEmail = getRecipientEmail(params.categoryName);
    console.log(`Sending event email for category: ${params.categoryName}, recipient: ${recipientEmail}`);
    
    const registrationDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    // Format team members for email
    const teamMembersList = params.teamMembers.map((member, index) => {
      const parts = [`${index + 1}. ${member.name}`];
      if (member.phone) parts.push(`Phone: ${member.phone}`);
      if (member.year) parts.push(`Year: ${member.year}`);
      return parts.join(' | ');
    }).join('\n');

    const templateParams = {
      to_email: params.email,
      to_name: params.captainName,
      cc_email: recipientEmail,
      registration_id: params.registrationId,
      event_name: params.eventName,
      category_name: params.categoryName,
      captain_name: params.captainName,
      captain_phone: params.captainPhone,
      captain_year: params.captainYear || 'Not specified',
      email: params.email,
      institution: params.institution,
      team_members: teamMembersList,
      fee_amount: `₹${params.feeAmount}`,
      delegate_id: params.delegateId || 'Not provided',
      coupon_code: params.couponCode || 'Not applied',
      participant_category: params.participantCategory || 'student',
      registration_date: registrationDate,
      payment_screenshot_url: params.payment_screenshot_url || '',
    };

    console.log('Using service:', EMAILJS_SERVICE_ID, 'template:', EMAILJS_EVENT_TEMPLATE_ID);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_EVENT_TEMPLATE_ID,
      templateParams
    );

    console.log('Event registration email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send event registration email:', error);
    return false;
  }
};

// Send delegate pass confirmation email directly via EmailJS
export const sendDelegatePassEmail = async (params: DelegateEmailParams): Promise<boolean> => {
  try {
    const registrationDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    const templateParams = {
      to_email: params.email,
      to_name: params.name,
      cc_email: 'Finance.igmcrisigma@gmail.com',
      delegate_id: params.delegateId,
      name: params.name,
      email: params.email,
      phone: params.phone,
      institution: params.institution,
      tier_name: params.tierName,
      tier_price: `₹${params.tierPrice}`,
      registration_date: registrationDate,
    };

    console.log('Sending delegate email with service:', EMAILJS_SERVICE_ID, 'template:', EMAILJS_DELEGATE_TEMPLATE_ID);
    
    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_DELEGATE_TEMPLATE_ID,
      templateParams
    );

    console.log('Delegate pass email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send delegate pass email:', error);
    return false;
  }
};

// Send concert booking confirmation email directly via EmailJS (uses separate Krishh service)
export const sendConcertBookingEmail = async (params: ConcertEmailParams): Promise<boolean> => {
  try {
    const bookingDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    const templateParams = {
      to_email: params.email,
      to_name: params.name,
      booking_id: params.bookingId,
      name: params.name,
      email: params.email,
      phone: params.phone,
      institution: params.institution,
      ticket_type: params.ticketType,
      ticket_price: `₹${params.ticketPrice}`,
      partner_name: params.partnerName || 'N/A',
      partner_phone: params.partnerPhone || 'N/A',
      booking_date: bookingDate,
    };

    console.log('Sending concert email with service:', EMAILJS_CONCERT_SERVICE_ID, 'template:', EMAILJS_CONCERT_TEMPLATE_ID);
    
    const response = await emailjs.send(
      EMAILJS_CONCERT_SERVICE_ID,
      EMAILJS_CONCERT_TEMPLATE_ID,
      templateParams
    );

    console.log('Concert booking email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send concert booking email:', error);
    return false;
  }
};
