import { Router } from 'express';
import { randomUUID } from 'crypto';

const router = Router();

router.get('/generate-uuid', (req, res) => {
  const uuid = randomUUID();
  res.json({ uuid });
});

export default router;