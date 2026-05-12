const client = require("prom-client");

const register = new client.Registry();

client.collectDefaultMetrics({
    register,
    prefix: "deployboard_",
});

const httpRequestDuration = new client.Histogram({
    name: "deployboard_http_request_duration_seconds",
    help: "Duración de las peticiones HTTP en segundos",
    labelNames: ["method", "route", "status_code"],
    buckets: [0.005, 0.01, 0.05, 0.1, 0.3, 0.5, 1, 2, 5],
});

const serviceStatusGauge = new client.Gauge({
    name: "deployboard_service_status",
    help: "Estado actual del servicio monitoreado: 1 online, 0 offline",
    labelNames: ["service_id", "service_name", "url"],
});

const serviceLatencyGauge = new client.Gauge({
    name: "deployboard_service_latency_ms",
    help: "Latencia del último health check del servicio en milisegundos",
    labelNames: ["service_id", "service_name", "url"],
});

register.registerMetric(httpRequestDuration);
register.registerMetric(serviceStatusGauge);
register.registerMetric(serviceLatencyGauge);

module.exports = {
    register,
    httpRequestDuration,
    serviceStatusGauge,
    serviceLatencyGauge,
};