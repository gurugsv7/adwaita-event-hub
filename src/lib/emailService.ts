import emailjs from '@emailjs/browser';

// EmailJS Configuration - Event Registrations (Adwaita service)
const EMAILJS_PUBLIC_KEY = 'mpWaG6BCMTapk477o';
const EMAILJS_SERVICE_ID = 'service_51ld944';
const EMAILJS_EVENT_TEMPLATE_ID = 'template_ujrecn4';

// EmailJS Configuration - Delegate Pass (separate service)
const EMAILJS_DELEGATE_PUBLIC_KEY = 'aW6oUkDunUsVZD8s8';
const EMAILJS_DELEGATE_SERVICE_ID = 'service_kh999ms';
const EMAILJS_DELEGATE_TEMPLATE_ID = 'template_pf3w0ha';

// EmailJS Configuration - Krishh Concert (separate service)
const EMAILJS_CONCERT_PUBLIC_KEY = 'aW6oUkDunUsVZD8s8';
const EMAILJS_CONCERT_SERVICE_ID = 'service_kh999ms';
const EMAILJS_CONCERT_TEMPLATE_ID = 'template_a8l2tnc';

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

// Helper function to get the proper screenshot URL
const getScreenshotUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // If it's already a full URL, return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Otherwise, construct the public URL from the filename
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/payment-screenshots/${url}`;
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
      to_email: recipientEmail, // Send to college incharge only
      to_name: 'Event Incharge',
      registration_id: params.registrationId,
      event_name: params.eventName,
      category_name: params.categoryName,
      captain_name: params.captainName,
      captain_phone: params.captainPhone,
      captain_year: params.captainYear || 'Not specified',
      email: params.email, // Registrant's email for reference
      institution: params.institution,
      team_members: teamMembersList,
      fee_amount: `₹${params.feeAmount}`,
      delegate_id: params.delegateId || 'Not provided',
      coupon_code: params.couponCode || 'Not applied',
      participant_category: params.participantCategory || 'student',
      registration_date: registrationDate,
      payment_screenshot_url: getScreenshotUrl(params.payment_screenshot_url),
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

// Send delegate pass confirmation email directly via EmailJS (uses separate delegate service)
export const sendDelegatePassEmail = async (params: DelegateEmailParams): Promise<boolean> => {
  try {
    const registrationDate = new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: 'Asia/Kolkata'
    });

    const templateParams = {
      to_email: 'Finance.igmcrisigma@gmail.com', // Send to finance team only
      to_name: 'Delegate Pass Incharge',
      delegate_id: params.delegateId,
      delegate_name: params.name,
      delegate_email: params.email,
      delegate_phone: params.phone,
      institution: params.institution,
      tier_name: params.tierName,
      tier_price: `₹${params.tierPrice}`,
      registration_date: registrationDate,
    };

    console.log('Sending delegate email with service:', EMAILJS_DELEGATE_SERVICE_ID, 'template:', EMAILJS_DELEGATE_TEMPLATE_ID);
    
    // Initialize with delegate-specific public key for this call
    emailjs.init(EMAILJS_DELEGATE_PUBLIC_KEY);
    
    const response = await emailjs.send(
      EMAILJS_DELEGATE_SERVICE_ID,
      EMAILJS_DELEGATE_TEMPLATE_ID,
      templateParams
    );
    
    // Re-initialize with main public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    console.log('Delegate pass email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send delegate pass email:', error);
    // Re-initialize with main public key on error
    emailjs.init(EMAILJS_PUBLIC_KEY);
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
    
    // Initialize with concert-specific public key for this call
    emailjs.init(EMAILJS_CONCERT_PUBLIC_KEY);
    
    const response = await emailjs.send(
      EMAILJS_CONCERT_SERVICE_ID,
      EMAILJS_CONCERT_TEMPLATE_ID,
      templateParams
    );
    
    // Re-initialize with main public key
    emailjs.init(EMAILJS_PUBLIC_KEY);

    console.log('Concert booking email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send concert booking email:', error);
    return false;
  }
};
