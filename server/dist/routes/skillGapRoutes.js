"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skillGapController_1 = require("../controllers/skillGapController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, skillGapController_1.getSkillGapAnalysis);
exports.default = router;
