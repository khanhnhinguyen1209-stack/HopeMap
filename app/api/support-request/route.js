import { supabase } from "@/lib/supabase";

await supabase.from("support_requests").insert({
  support_level: data.support_level,
  district: data.district,
  contact_methods: data.contact_methods,
  description: data.description,
  phone: data.phone ?? null
});
