const { httpRequestDuration } = require("../metrics/prometheus.metrics");

function metricsMiddleware(req, res, next) {
    const start = process.hrtime();

    res.on("finish", () => {
        const diff = process.hrtime(start);
        const duration = diff[0] + diff[1] / 1e9;

        const route = req.route?.path || req.path;

        httpRequestDuration
            .labels(req.method, route, res.statusCode)
            .observe(duration);
    });

    next();
}

module.exports = metricsMiddleware;