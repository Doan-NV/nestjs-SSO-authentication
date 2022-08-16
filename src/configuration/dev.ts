export default () => ({
  app: {
    baseUrlPrefix: '/api',
    docsBaseUrl: '/docs',
  },
  accessToken: {
    expiresIn: '8h',
    secret: 'superSecretKey',
  },
  refreshToken: {
    expiresIn: '1d',
  },
  verify: {
    expiresIn: '30m',
    secret: 'verifySecret',
  },
});
