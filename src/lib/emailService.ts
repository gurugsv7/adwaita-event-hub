import { supabase } from "@/integrations/supabase/client";

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

// Send event registration confirmation email via edge function
export const sendEventRegistrationEmail = async (params: EventEmailParams): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'event',
        ...params,
      },
    });

    if (error) {
      console.error('Failed to send event registration email:', error);
      return false;
    }

    console.log('Event registration email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send event registration email:', error);
    return false;
  }
};

// Send delegate pass confirmation email via edge function
export const sendDelegatePassEmail = async (params: DelegateEmailParams): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'delegate',
        ...params,
      },
    });

    if (error) {
      console.error('Failed to send delegate pass email:', error);
      return false;
    }

    console.log('Delegate pass email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send delegate pass email:', error);
    return false;
  }
};

// Send concert booking confirmation email via edge function
export const sendConcertBookingEmail = async (params: ConcertEmailParams): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        type: 'concert',
        ...params,
      },
    });

    if (error) {
      console.error('Failed to send concert booking email:', error);
      return false;
    }

    console.log('Concert booking email sent successfully:', data);
    return true;
  } catch (error) {
    console.error('Failed to send concert booking email:', error);
    return false;
  }
};
