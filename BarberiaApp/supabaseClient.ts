import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config/supabaseConfig";
import { Platform } from 'react-native';

const getStorage = () => {
  if (Platform.OS === 'web') return undefined;
  return require("@react-native-async-storage/async-storage").default;
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
        storage: getStorage(),
        autoRefreshToken: true,   
        persistSession: true,     
        detectSessionInUrl: false,
        storageKey: 'sb-ritual-auth', 
    }
})
