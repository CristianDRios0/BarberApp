export interface Auth{
    userId: string | null;
    email: string | null;
    role: string | null;
    isAuthenticated: boolean | null;
    isLoading: boolean | null;
}