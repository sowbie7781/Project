"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const readinessController_1 = require("../controllers/readinessController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', auth_1.authenticate, readinessController_1.getCareerReadiness);
exports.default = router;
