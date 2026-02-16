export interface InitialUser {
isAuth: boolean;
token: string | null;
refreshToken: string | null;
loading: boolean;
error: string | unknown | null;
user: { email: string; name: string; id: string } | null;
balance: number;
}

