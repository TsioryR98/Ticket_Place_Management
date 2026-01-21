import express from 'express';
import googleOauth from '../google/googleSyncOauth.js';

const router = express.Router();

router.post('/auth/google', googleOauth);

export { router as googleOauthRouter };
