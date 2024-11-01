//This file is for the routes of the CRUD operations
import express from "express";
import * as VisitorsController from "../controllers/visitors";
import { requireAuth } from "../middleware/auth";
import { requiresAuth } from "express-openid-connect";

const router = express.Router();

// apply authentication middleware
router.use(requireAuth);
//get all visitors
router.get("/", requiresAuth(), VisitorsController.getVisitors);
//get one visitor
router.get("/:visitorId", VisitorsController.getVisitor);
//create a visitor
router.post("/", VisitorsController.createVisitor);
//update a visitor
router.patch("/:visitorId", VisitorsController.updateVisitor);
//delete a visitor
router.delete("/:visitorId", VisitorsController.deleteVisitor);

export default router;