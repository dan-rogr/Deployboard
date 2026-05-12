const express = require("express");
const router = express.Router();

const {
    getServices,
    createService,
    getServiceById,
    updateService,
    deleteService,
    checkServiceById,
    checkAllServices,
    getServiceChecks,
} = require("../controllers/service.controller");

router.get("/", getServices);
router.post("/", createService);

router.get("/:id/checks", getServiceChecks);
router.post("/check-all", checkAllServices);
router.post("/:id/check", checkServiceById);

router.get("/:id", getServiceById);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

module.exports = router;