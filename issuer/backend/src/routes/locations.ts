import express from "express";
import * as LocationsController from "../controllers/locations";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

// apply authentication middleware
router.use(requireAuth);

// CRUD operations
router.get("/", LocationsController.getLocations);
router.get("/:locationId", LocationsController.getLocation);
router.post("/", LocationsController.createLocation);
router.patch("/:locationId", LocationsController.updateLocation);
router.delete("/:locationId", LocationsController.deleteLocation);

export default router;
