import promclient from 'prom-client'

const register = new promclient.Registry();

export default async (req, res) => {
    try {
        res.header('Content-Type', register.contentType);
        const metrics = await register.metrics();
        // console.log("metrics", metrics);
        res.send(metrics)
    }
    catch (err) {
        console.log(err)
        res.code(500).send(err.message)
    }
}