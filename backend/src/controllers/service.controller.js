const pool = require("../config/db");
const { checkServiceHealth } = require("../services/healthCheck.service");

const getServices = async (req, res, next) => {
    try {
        const result = await pool.query(`
            SELECT 
                s.id,
                s.project_id,
                p.name AS project_name,
                s.name,
                s.url,
                s.status,
                s.latency_ms,
                s.last_checked_at,
                s.created_at
            FROM services s
            JOIN projects p ON s.project_id = p.id
            ORDER BY s.id ASC
        `);

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

const createService = async (req, res, next) => {
    try {
        const { project_id, name, url } = req.body;

        if (!project_id || !name || !url) {
            return res.status(400).json({
                message: "project_id, name and url are required",
            });
        }

        const result = await pool.query(
            `
            INSERT INTO services (project_id, name, url)
            VALUES ($1, $2, $3)
            RETURNING *
            `,
            [project_id, name, url]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const getServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "SELECT * FROM services WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const updateService = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, url } = req.body;

        const result = await pool.query(
            `
            UPDATE services
            SET name = $1, url = $2
            WHERE id = $3
            RETURNING *
            `,
            [name, url, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        next(error);
    }
};

const deleteService = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM services WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        res.json({ message: "Service deleted successfully" });
    } catch (error) {
        next(error);
    }
};

const checkServiceById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const serviceResult = await pool.query(
            "SELECT * FROM services WHERE id = $1",
            [id]
        );

        if (serviceResult.rows.length === 0) {
            return res.status(404).json({ message: "Service not found" });
        }

        const updatedService = await checkServiceHealth(serviceResult.rows[0]);

        res.json(updatedService);
    } catch (error) {
        next(error);
    }
};

const checkAllServices = async (req, res, next) => {
    try {
        const servicesResult = await pool.query(
            "SELECT * FROM services ORDER BY id ASC"
        );

        const services = servicesResult.rows;

        const checkedServices = [];

        for (const service of services) {
            const updatedService = await checkServiceHealth(service);
            checkedServices.push(updatedService);
        }

        res.json({
            message: "All services checked successfully",
            total: checkedServices.length,
            services: checkedServices,
        });
    } catch (error) {
        next(error);
    }
};

const getServiceChecks = async (req, res, next) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT *
            FROM service_checks
            WHERE service_id = $1
            ORDER BY checked_at DESC
            LIMIT 50
            `,
            [id]
        );

        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getServices,
    createService,
    getServiceById,
    updateService,
    deleteService,
    checkServiceById,
    checkAllServices,
    getServiceChecks,
};