const express = require("express");
const cors = require("cors");

const healthRoutes = require("./routes/health.routes");
const dbRoutes = require("./routes/db.routes");
const projectRoutes = require("./routes/project.routes");
const serviceRoutes = require("./routes/service.routes");
const errorHandler = require("./middleware/error.middleware");
const metricsMiddleware = require("./middleware/metrics.middleware");
const { register } = require("./metrics/prometheus.metrics");

const app = express();

app.use(cors());
app.use(express.json());
app.use(metricsMiddleware);

app.get("/metrics", async (req, res, next) => {
    try {
        res.set("Content-Type", register.contentType);
        res.end(await register.metrics());
    } catch (error) {
        next(error);
    }
});

app.get("/api", (req, res) => {
    res.json({
        message: "DeployBoard API is running",
    });
});

app.use("/", healthRoutes);
app.use("/", dbRoutes);
app.use("/api", projectRoutes);
app.use("/api/services", serviceRoutes);

app.use(errorHandler);

module.exports = app;