import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ngqbmgwjvldborggrbvo.supabase.co';
const supabaseKey = 'sb_publishable_AbqXNbi2fddZr-zbk6LXPA_G4E3fdnz';

export const supabase = createClient(supabaseUrl, supabaseKey);