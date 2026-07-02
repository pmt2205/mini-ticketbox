export const appConfig = () => ({
  port: Number(process.env.PORT ?? 3001),
  reservation: {
    ttlSeconds: Number(process.env.RESERVATION_TTL_SECONDS ?? 300),
    releaseBatchSize: Number(process.env.RESERVATION_RELEASE_BATCH_SIZE ?? 100),
    releaseCron: process.env.RESERVATION_RELEASE_CRON ?? '*/15 * * * * *',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET ?? 'local-development-secret',
    jwtExpiresInSeconds: Number(process.env.JWT_EXPIRES_IN_SECONDS ?? 86400),
  },
});
