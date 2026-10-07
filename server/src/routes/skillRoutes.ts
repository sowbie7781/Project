import { Router } from 'express';
import { getSkills, getSkillById } from '../controllers/skillController';

const router = Router();

router.get('/', getSkills);
router.get('/:id', getSkillById);

export default router;
