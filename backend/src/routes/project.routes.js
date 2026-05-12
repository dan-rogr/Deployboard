const express = require("express");

const {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
} = require("../controllers/project.controller");

const router = express.Router();

router.get("/projects", getProjects);
router.post("/projects", createProject);
router.get("/projects/:id", getProjectById);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

module.exports = router;