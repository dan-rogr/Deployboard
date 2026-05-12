const pool = require("../config/db");
const { checkServiceHealth } = require("./healthCheck.service");

const CHECK_INTERVAL_MS = 30000;

const startMonitoringScheduler = () => {
    console.log("Monitoring scheduler started");

    setInterval(async () => {
        try {
            const result = await pool.query("SELECT * FROM services ORDER BY id ASC");
            const services = result.rows;

            for (const service of services) {
                const updatedService = await checkServiceHealth(service);

                console.log(
                    `[MONITOR] ${updatedService.name} - ${updatedService.status} - ${updatedService.latency_ms}ms`
                );
            }
        } catch (error) {
            console.error("Error running monitoring scheduler:", error.message);
        }
    }, CHECK_INTERVAL_MS);
};

module.exports = {
    startMonitoringScheduler,
};