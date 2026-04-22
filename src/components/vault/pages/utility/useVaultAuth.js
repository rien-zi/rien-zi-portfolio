import { useEffect, useState } from "react";
import { getSupabase } from "../../../../lib/supabase";

export const useVaultAuth = () => {
    const [user, setUser] = useState(null);
    const [supabase, setSupabase] = useState(null);

    useEffect(() => {
        let listener;

        const init = async () => {
            const client = await getSupabase();
            setSupabase(client);

            const { data } = await client.auth.getSession();
            setUser(data.session?.user || null);

            const sub = client.auth.onAuthStateChange((_event, session) => {
                setUser(session?.user || null);
            });

            listener = sub.data.subscription;
        };

        init();

        return () => {
            if (listener) listener.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        if (!supabase) return;

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        return error;
    };

    const logout = async () => {
        if (!supabase) return;

        await supabase.auth.signOut();
        setUser(null);
    };

    return { user, login, logout };
};