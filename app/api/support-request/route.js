import { supabase } from "@/lib/supabase";

const { error } = await supabase
  .from("support_requests")
  .insert({
    support_level: data.support_level,   // "emergency" | "chat"
    district: data.district,              // "quan1", "quan3", ...
    contact_methods: data.contact_methods, // array text[]
    description: data.description,
    phone: data.phone ?? null,
    lat: data.lat ?? null,
    lng: data.lng ?? null,
  });

if (error) {
  console.error("SUPABASE INSERT ERROR:", error);
  alert(error.message);
  return;
}
