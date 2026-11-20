import passport from 'passport';

import { userResponse } from './user.controller';

export function createSession(req, res, next) {
  passport.authenticate('local', (err, user) => {
    if (err) {
      next(err);
      return;
    }
    if (!user) {
      res.status(401).json({ message: 'Invalid username or password.' });
      return;
    }

    req.logIn(user, (innerErr) => {
      if (innerErr) {
        next(innerErr);
        return;
      }
      res.json(userResponse(req.user));
    });
  })(req, res, next);
}

export function getSession(req, res) {
  if (!req.user) {
    return res.status(200).send({ user: null });
  }
  if (req.user.banned) {
    return res.status(403).send({ message: 'Forbidden: User is banned.' });
  }

  // Clear image cache on each session access to ensure fresh sketches
  if (req.session) {
    delete req.session.imagesCache;
  }

  return res.json(userResponse(req.user));
}

export function destroySession(req, res, next) {
  req.logout((err) => {
    if (err) {
      next(err);
      return;
    }
    req.session.destroy((error) => {
      if (error) {
        next(error);
        return;
      }
      res.json({ success: true });
    });
  });
}

// New helper to explicitly clear image cache if needed
export function clearCache(req, res, next) {
  if (req.session) {
    delete req.session.imagesCache;
  }
  res.json({ success: true });
}