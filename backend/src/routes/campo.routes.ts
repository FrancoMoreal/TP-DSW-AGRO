import { Router } from "express";
import { controller } from "../controllers/campo.controller.js";
import validateToken from "./validate-token.js";

const campoRouter = Router();

campoRouter.get("/:clienteId", validateToken, controller.getCampos);
campoRouter.get("/:clienteId/:campoId", validateToken, controller.getCampo);
campoRouter.post("/:clienteId", validateToken, controller.createCampo);
campoRouter.put("/:clienteId/:campoId", validateToken, controller.updatecampo);
campoRouter.delete("/:clienteId/:campoId", validateToken, controller.deletecampo);

export default campoRouter;
