const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        let body;

        // Safely parse body (handle both string and object cases)
        if (typeof event.body === "string") {
            body = JSON.parse(event.body);
        } else {
            body = event.body;
        }

        const res = await fetch("https://irisaut.space/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        const data = await res.text();

        return {
            statusCode: res.status,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: data,
        };
    } catch (err) {
        console.error("Proxy error:", err, event);

        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            body: JSON.stringify({ error: "Proxy failed", details: err.message }),
        };
    }
};