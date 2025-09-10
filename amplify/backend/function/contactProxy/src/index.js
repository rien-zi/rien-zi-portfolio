const fetch = require("node-fetch");

exports.handler = async (event) => {
    try {
        const body = JSON.parse(event.body);

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
        console.error("Proxy error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Proxy failed" }),
        };
    }
};
