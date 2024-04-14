import {Router} from 'express';
const router = Router();

import AuthRouter from './AuthRoute.js';

router.use('/api/v1/auth', AuthRouter); // Auth route

export default router;