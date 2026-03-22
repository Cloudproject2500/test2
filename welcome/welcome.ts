import { supabase } from '../src/lib/supabase.ts'

declare global {
    interface Window {
        selectRole: (role: 'student' | 'instructor') => Promise<void>;
    }
}

window.selectRole = async (role: 'student' | 'instructor') => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'flex';

    try {
        // Get the current logged in user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            throw new Error("You must be logged in to select a role.");
        }

        // Update the user's role in the custom profiles table
        const { error: updateError } = await supabase
            .from('profiles')
            .update({ role: role })
            .eq('user_id', user.id);

        if (updateError) {
            throw updateError;
        }

        // Redirect to main dashboard
        window.location.href = '/demo/index.html';

    } catch (err: any) {
        console.error("Error setting role:", err);
        alert("Failed to save your selection: " + err.message);
        if (overlay) overlay.style.display = 'none';
    }
};
