export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
};

export type AuthResponse = {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
};

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterInput = AuthCredentials & {
  fullName: string;
};
