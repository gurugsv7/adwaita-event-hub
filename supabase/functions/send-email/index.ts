import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// EmailJS configuration from environment variables
const EMAILJS_SERVICE_ID = Deno.env.get('EMAILJS_SERVICE_ID') || 'service_wtt60xf';
const EMAILJS_PUBLIC_KEY = Deno.env.get('EMAILJS_PUBLIC_KEY') || 'acbz69d146b3J-jEm';
const EMAILJS_EVENT_TEMPLATE_ID = Deno.env.get('EMAILJS_EVENT_TEMPLATE_ID') || 'template_0uzpwjc';
const EMAILJS_DELEGATE_TEMPLATE_ID = Deno.env.get('EMAILJS_DELEGATE_TEMPLATE_ID') || 'template_kh3a565';

// Krishh Concert uses separate EmailJS account
const EMAILJS_CONCERT_SERVICE_ID = 'service_kh999ms';
const EMAILJS_CONCERT_PUBLIC_KEY = 'aW6oUkDunUsVZD8s8';
const EMAILJS_CONCERT_TEMPLATE_ID = 'template_a8l2tnc';

// Category to email mapping
const CATEGORY_EMAIL_MAP: Record<string, string> = {
  'culturals': 'Adwaitaigmcri@gmail.com',
  'fine-arts': 'Adwaitaigmcri@gmail.com',
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
  'designing': 'Finance.igmcrisigma@gmail.com',
  'other': 'Finance.igmcrisigma@gmail.com',
};

const DEFAULT_EMAIL = 'Finance.igmcrisigma@gmail.com';

interface TeamMember {
  name: string;
  phone?: string;
  year?: string;
}

interface EventEmailRequest {
  type: 'event';
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

interface DelegateEmailRequest {
  type: 'delegate';
  delegateId: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  tierName: string;
  tierPrice: number;
}

interface ConcertEmailRequest {
  type: 'concert';
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

type EmailRequest = EventEmailRequest | DelegateEmailRequest | ConcertEmailRequest;

const getRecipientEmail = (categoryName: string): string => {
  const normalizedCategory = categoryName.toLowerCase().replace(/\s+/g, '-');
  return CATEGORY_EMAIL_MAP[normalizedCategory] || DEFAULT_EMAIL;
};

const formatTeamMembers = (members: TeamMember[]): string => {
  if (members.length <= 1) return 'Individual participation';
  
  return members.map((member, index) => {
    if (index === 0) {
      return `Captain: ${member.name} (${member.phone || 'N/A'}) - ${member.year || 'N/A'}`;
    }
    return `Member ${index + 1}: ${member.name}${member.phone ? ` (${member.phone})` : ''}${member.year ? ` - ${member.year}` : ''}`;
  }).join('\n');
};

const sendEmailJS = async (
  templateId: string, 
  templateParams: Record<string, string>,
  serviceId: string = EMAILJS_SERVICE_ID,
  publicKey: string = EMAILJS_PUBLIC_KEY
): Promise<boolean> => {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: templateParams,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('EmailJS error:', errorText);
    throw new Error(`EmailJS send failed: ${errorText}`);
  }

  return true;
};

const handleEventEmail = async (data: EventEmailRequest): Promise<boolean> => {
  const recipientEmail = getRecipientEmail(data.categoryName);
  console.log(`Sending event email for category: ${data.categoryName}, recipient: ${recipientEmail}`);
  
  const registrationDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const templateParams = {
    to_email: recipientEmail,
    registration_id: data.registrationId,
    event_name: data.eventName,
    category_name: data.categoryName,
    captain_name: data.captainName,
    captain_phone: data.captainPhone,
    captain_year: data.captainYear || 'Not specified',
    participant_email: data.email,
    institution: data.institution,
    team_members: formatTeamMembers(data.teamMembers),
    team_size: String(data.teamMembers.length),
    fee_amount: `₹${data.feeAmount}`,
    delegate_id: data.delegateId || 'Not provided',
    coupon_code: data.couponCode || 'Not used',
    participant_category: data.participantCategory || 'Not specified',
    registration_date: registrationDate,
    payment_screenshot_url: data.payment_screenshot_url || '',
  };

  console.log('Using service:', EMAILJS_SERVICE_ID, 'template:', EMAILJS_EVENT_TEMPLATE_ID);
  return sendEmailJS(EMAILJS_EVENT_TEMPLATE_ID, templateParams);
};

const handleDelegateEmail = async (data: DelegateEmailRequest): Promise<boolean> => {
  const registrationDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const templateParams = {
    to_email: DEFAULT_EMAIL,
    delegate_id: data.delegateId,
    delegate_name: data.name,
    delegate_email: data.email,
    delegate_phone: data.phone,
    institution: data.institution,
    tier_name: data.tierName,
    tier_price: `₹${data.tierPrice}`,
    registration_date: registrationDate,
  };

  return sendEmailJS(EMAILJS_DELEGATE_TEMPLATE_ID, templateParams);
};

const handleConcertEmail = async (data: ConcertEmailRequest): Promise<boolean> => {
  const bookingDate = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  const templateParams = {
    to_email: DEFAULT_EMAIL,
    booking_id: data.bookingId,
    name: data.name,
    email: data.email,
    phone: data.phone,
    institution: data.institution,
    ticket_type: data.ticketType,
    ticket_price: `₹${data.ticketPrice}`,
    partner_name: data.partnerName || 'N/A (Stag Entry)',
    partner_phone: data.partnerPhone || 'N/A',
    booking_date: bookingDate,
  };

  // Use separate EmailJS account for Krishh Concert
  return sendEmailJS(
    EMAILJS_CONCERT_TEMPLATE_ID, 
    templateParams,
    EMAILJS_CONCERT_SERVICE_ID,
    EMAILJS_CONCERT_PUBLIC_KEY
  );
};

serve(async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    console.log('Received email request:', data.type);

    let success = false;

    switch (data.type) {
      case 'event':
        success = await handleEventEmail(data);
        console.log('Event email sent successfully');
        break;
      case 'delegate':
        success = await handleDelegateEmail(data);
        console.log('Delegate email sent successfully');
        break;
      case 'concert':
        success = await handleConcertEmail(data);
        console.log('Concert email sent successfully');
        break;
      default:
        throw new Error('Invalid email type');
    }

    return new Response(
      JSON.stringify({ success }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
});
