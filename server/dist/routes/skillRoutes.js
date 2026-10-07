"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skillController_1 = require("../controllers/skillController");
const router = (0, express_1.Router)();
router.get('/', skillController_1.getSkills);
router.get('/:id', skillController_1.getSkillById);
exports.default = router;
