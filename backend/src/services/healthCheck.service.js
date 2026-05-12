const axios = require("axios");
const pool = require("../config/db");

const {
    serviceStatusGauge,
    serviceLatencyGauge,
} = require("../metrics/prometheus.metrics");

const saveServiceCheck = async (serviceId, status, latency) => {
    await pool.query(
        `
        INSERT INTO service_checks (service_id, status, latency_ms)
        VALUES ($1, $2, $3)
        `,
        [serviceId, status, latency]
    );
};

const updateServiceMetrics = (service, status, latency) => {
    serviceStatusGauge
        .labels(
            String(service.id),
            service.name,
            service.url
        )
        .set(status === "online" ? 1 : 0);

    serviceLatencyGauge
        .labels(
            String(service.id),
            service.name,
            service.url
        )
        .set(latency || 0);
};

const updateServiceStatus = async (service, status, latency) => {
    const result = await pool.query(
        `
        UPDATE services
        SET status = $1,
            latency_ms = $2,
            last_checked_at = NOW()
        WHERE id = $3
        RETURNING *
        `,
        [status, latency, service.id]
    );

    await saveServiceCheck(service.id, status, latency);

    updateServiceMetrics(service, status, latency);

    return result.rows[0];
};

const checkServiceHealth = async (service) => {
    const startTime = Date.now();

    try {
        await axios.get(service.url, {
            timeout: 5000,
        });

        const latency = Date.now() - startTime;

        return await updateServiceStatus(service, "online", latency);
    } catch (error) {
        const latency = Date.now() - startTime;

        return await updateServiceStatus(service, "offline", latency);
    }
};

module.exports = {
    checkServiceHealth,
};