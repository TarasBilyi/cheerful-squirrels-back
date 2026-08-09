import crypto from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';
import { Session } from '../models/session.js';

export const createSession = async (userId) => {
  const accessToken = crypto.randomUUID();
  const refreshToken = crypto.randomUUID();

  return Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  });
};

export const setSessionCookies = (res, session) => {
  const isProduction = process.env.NODE_ENV === 'production';

  res.cookie('accessToken', session.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: FIFTEEN_MINUTES,
  });

  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: ONE_DAY,
  });

  res.cookie('sessionId', session._id, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: ONE_DAY,
  });
};
