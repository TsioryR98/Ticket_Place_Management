import express from 'express';
import googleAuth from '../google/googleSyncOauth';

const router = express.Router();

router.post('/auth/google', googleAuth);

export { router as googleOauthRouter };
