require("dotenv").config();
const { startMonitoringScheduler } = require("./services/monitoringScheduler.service");

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`DeployBoard API running on port ${PORT}`);

    startMonitoringScheduler();
});