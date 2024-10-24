export interface User {
    sub: string;
    acr: string;
    email: string;
    email_verified: boolean;
    name: string;
    given_name: string;
    preferred_username: string;
    nickname: string;
    groups: string[];
    accessToken: {
        access_token: string;
        token_type: string;
        expires_in: number;
    };
}
