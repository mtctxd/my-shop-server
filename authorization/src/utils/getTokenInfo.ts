type TokenInfo = {
  principalId?: string;
  token?: string;
};

export const getTokenInfo = (authorizationToken: string): TokenInfo => {
  const tokenInfo: TokenInfo = {};
  const hashedTokenString = authorizationToken.split(' ')[1];

  if (!hashedTokenString) {
    return tokenInfo;
  }

  const parsedToken = Buffer.from(hashedTokenString, 'base64');
  const [principalId, token] = parsedToken.toString('ascii').split(':');

  if (principalId) {
    tokenInfo.principalId = principalId;
  }

  if (token) {
    tokenInfo.token = token;
  }

  return tokenInfo;
};