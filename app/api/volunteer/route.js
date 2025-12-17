import { supabase } from "@/lib/supabase";

await supabase.from("volunteers").insert({
  support_types: data.support_types,
  district: data.district
});
