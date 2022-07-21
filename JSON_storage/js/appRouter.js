"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const appController_1 = __importDefault(require("./appController"));
const router = (0, express_1.Router)();
router.get('/', appController_1.default.getHelper);
router.post('/', appController_1.default.postHelper);
router.get('/:json_name', appController_1.default.sendJson);
router.post('/:json_name', appController_1.default.saveJson);
exports.default = router;
