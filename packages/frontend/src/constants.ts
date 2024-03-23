import { createClient } from "@supabase/supabase-js";

export const TOKEN_SECRET = "helloworld";

const SUPABASE_URL = "https://mjrrhdjdbsaystkbxvup.supabase.co";

// anon key는 어차피 클라가 알아야하니까 대충 때려박음
const SUPABASE_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcnJoZGpkYnNheXN0a2J4dnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjIzMDI2NzcsImV4cCI6MTk3Nzg3ODY3N30.eC3WDXnaIXy21bI8oGPaHTsLeE0jEmjk2qCDycB-AXc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
