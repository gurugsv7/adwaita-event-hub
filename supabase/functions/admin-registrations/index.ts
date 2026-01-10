import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.89.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { password, eventId, action } = await req.json();
    
    console.log('Admin registrations request received - action:', action, 'eventId:', eventId);

    // Verify admin password
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');
    if (!adminPassword || password !== adminPassword) {
      console.log('Invalid admin password attempt');
      return new Response(
        JSON.stringify({ error: 'Invalid password' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role key to bypass RLS
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // If action is 'counts', return registration counts per event
    if (action === 'counts') {
      console.log('Fetching registration counts per event');
      const { data: allRegistrations, error: countError } = await supabase
        .from('registrations')
        .select('event_id');
      
      if (countError) {
        console.error('Error fetching counts:', countError);
        return new Response(
          JSON.stringify({ error: countError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Count registrations per event
      const counts: Record<string, number> = {};
      allRegistrations?.forEach((reg) => {
        counts[reg.event_id] = (counts[reg.event_id] || 0) + 1;
      });

      console.log('Successfully fetched counts for', Object.keys(counts).length, 'events');
      return new Response(
        JSON.stringify({ counts }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If action is 'concert_count', return total concert bookings count
    if (action === 'concert_count') {
      console.log('Fetching concert bookings count');
      const { count, error: countError } = await supabase
        .from('concert_bookings')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error fetching concert count:', countError);
        return new Response(
          JSON.stringify({ error: countError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Concert bookings count:', count);
      return new Response(
        JSON.stringify({ count: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If action is 'concert_bookings', return all concert bookings
    if (action === 'concert_bookings') {
      console.log('Fetching all concert bookings');
      const { data: concertData, error: concertError } = await supabase
        .from('concert_bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (concertError) {
        console.error('Error fetching concert bookings:', concertError);
        return new Response(
          JSON.stringify({ error: concertError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully fetched', concertData?.length || 0, 'concert bookings');
      return new Response(
        JSON.stringify({ bookings: concertData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If action is 'delegate_count', return total delegates count
    if (action === 'delegate_count') {
      console.log('Fetching delegates count');
      const { count, error: countError } = await supabase
        .from('delegates')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.error('Error fetching delegates count:', countError);
        return new Response(
          JSON.stringify({ error: countError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Delegates count:', count);
      return new Response(
        JSON.stringify({ count: count || 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If action is 'delegates', return all delegate registrations
    if (action === 'delegates') {
      console.log('Fetching all delegate registrations');
      const { data: delegatesData, error: delegatesError } = await supabase
        .from('delegates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (delegatesError) {
        console.error('Error fetching delegates:', delegatesError);
        return new Response(
          JSON.stringify({ error: delegatesError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Successfully fetched', delegatesData?.length || 0, 'delegate registrations');
      return new Response(
        JSON.stringify({ delegates: delegatesData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let data;
    let error;

    if (eventId) {
      // Fetch registrations for specific event
      console.log('Fetching registrations for event:', eventId);
      const result = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });
      
      data = result.data;
      error = result.error;
    } else {
      // Fetch all registrations
      console.log('Fetching all registrations');
      const result = await supabase
        .from('registrations')
        .select('*')
        .order('created_at', { ascending: false });
      
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error fetching registrations:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Successfully fetched', data?.length || 0, 'registrations');

    return new Response(
      JSON.stringify({ registrations: data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in admin-registrations function:', error);
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
