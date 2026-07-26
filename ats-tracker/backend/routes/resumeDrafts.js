import express from 'express';
import { getDrafts, getDraft, createDraft, updateDraft, deleteDraft } from '../controllers/resumeDraftController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.use(verifyToken);

router.get('/', getDrafts);
router.post('/', createDraft);
router.get('/:id', getDraft);
router.put('/:id', updateDraft);
router.delete('/:id', deleteDraft);

export default router;
