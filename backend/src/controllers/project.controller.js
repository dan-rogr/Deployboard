const pool = require("../config/db");

async function getProjects(req, res, next) {
    try {
        const result = await pool.query(
            "SELECT * FROM projects ORDER BY created_at DESC"
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
}

async function createProject(req, res, next) {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                error: true,
                message: "Project name is required",
            });
        }

        const result = await pool.query(
            "INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING *",
            [name, description || null]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function getProjectById(req, res, next) {
    try {
        const { id } = req.params;

        const result = await pool.query("SELECT * FROM projects WHERE id = $1", [
            id,
        ]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Project not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function updateProject(req, res, next) {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const result = await pool.query(
            `UPDATE projects
       SET name = COALESCE($1, name),
           description = COALESCE($2, description)
       WHERE id = $3
       RETURNING *`,
            [name, description, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Project not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
}

async function deleteProject(req, res, next) {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM projects WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Project not found",
            });
        }

        res.json({
            message: "Project deleted successfully",
            project: result.rows[0],
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getProjects,
    createProject,
    getProjectById,
    updateProject,
    deleteProject,
};