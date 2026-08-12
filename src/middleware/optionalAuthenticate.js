import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export const optionalAuthenticate = async (req, res, next) => {
  const { sessionId, accessToken } = req.cookies;

  if (!sessionId || !accessToken) {
    req.user = null;
    return next();
  }

  const session = await Session.findOne({
    _id: sessionId,
    accessToken,
  });

  if (!session || session.accessTokenValidUntil < new Date()) {
    req.user = null;
    return next();
  }

  const user = await User.findById(session.userId);

  req.user = user || null;

  next();
};
