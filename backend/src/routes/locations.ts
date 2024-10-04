//This file is for the routes of the CRUD operations
import express from "express";
import * as LocationsController from "../controllers/locations";
//initalize router
const router = express.Router();
//get all Locations
router.get("/", LocationsController.getLocations);
//get one location
router.get("/:locationId", LocationsController.getLocation);
//create a location
router.post("/", LocationsController.createLocation);
//update a location
router.patch("/:locationId", LocationsController.updateLocation);
//delete a location
router.delete("/:locationId", LocationsController.deleteLocation);

export default router;