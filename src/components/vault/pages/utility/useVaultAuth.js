import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabase";

export const useVaultAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const init = async () => {
            const { data } = await supabase.auth.getSession();
            setUser(data.session?.user || null);
        };

        init();

        const { data: listener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user || null);
            }
        );

        return () => listener.subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return { user, login, logout };
};