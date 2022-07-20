import {Router} from "express";
import appController from "./appController";

const router: Router = new Router();

router.get('/', appController.getHelper);

router.post('/', appController.postHelper);

router.get('/:json_name', appController.sendJson);

router.post('/:json_name', appController.saveJson);

export default router;