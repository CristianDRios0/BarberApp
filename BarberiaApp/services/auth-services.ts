import { supabase } from "@/supabaseClient"

export const login = async (email: string) => {
    if (!email || email.trim() === "") {
        throw new Error("Debes ingresar tu correo electrónico para continuar.");
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new Error("El formato del correo no es válido.");
    }
    const {data, error} = await supabase.auth.signInWithOtp({ email, options: {shouldCreateUser: false} });
    console.log('Respuesta de login:', { data, error });
    if (error) {
        if (error.message.includes("Signups not allowed")) {
            throw new Error("Este correo no está registrado en el sistema.");
        }
        throw new Error(error.message);
    }
    return data;
}

export const verifyCode = async (email: string, token: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'email'
    });
    console.log('Respuesta de verificación de código:', { data, error });
    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.log('Error al cerrar sesión:', error);
        throw new Error(error.message);
    }
}