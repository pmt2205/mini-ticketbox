export type AuthUserDto = {
  id: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
};

export type AuthResponseDto = {
  accessToken: string;
  expiresIn: number;
  user: AuthUserDto;
};
