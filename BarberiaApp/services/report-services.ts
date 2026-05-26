import { supabase } from "@/supabaseClient";

export const getDashboardData = async () => {
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats')

    if(error){
        throw new Error(error.message);

    }
    return data
};
