import { signJwt, verifyJwt } from './jwt.util';

describe('jwt.util', () => {
  it('signs and verifies a JWT', () => {
    const token = signJwt(
      {
        sub: 'user-id',
        email: 'user@example.com',
        fullName: 'Test User',
        role: 'ADMIN',
      },
      'secret',
      60,
    );

    const payload = verifyJwt(token, 'secret');

    expect(payload?.sub).toBe('user-id');
    expect(payload?.email).toBe('user@example.com');
    expect(payload?.role).toBe('ADMIN');
  });

  it('rejects a token signed with another secret', () => {
    const token = signJwt(
      {
        sub: 'user-id',
        email: 'user@example.com',
        fullName: 'Test User',
        role: 'USER',
      },
      'secret',
      60,
    );

    expect(verifyJwt(token, 'another-secret')).toBeNull();
  });
});
