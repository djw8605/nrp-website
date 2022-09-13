import { PrometheusDriver } from 'prometheus-query';

const prom = new PrometheusDriver({
  endpoint: "https://prometheus.nrp-nautilus.io/",
  baseURL: "/api/v1", // default value
  timeout: 60000
});

export default async function handler(req, res) {
    //console.log("Got request for cache utilization");
    const url = new URL(req.url, `http://${req.headers.host}`);
    const cache = url.searchParams.get('cache');
    if (!cache){
        console.log("No cache specified");
        res.status(400).json({ error: "No cache specified" });
        return;
    }
    //console.log("Cache:", cache);
    //const query = `sum(irate(cache_read_bytes_total{cache="${cache}"}[5m])) / sum(irate(cache_write_bytes_total{cache="${cache}"}[5m]))`;
    const query =`instance:node_network_transmit_bytes:rate:sum{instance="${cache}"}`
    var transmitResult = await prom.instantQuery(query);
    const receiveQuery = `instance:node_network_receive_bytes:rate:sum{instance="${cache}"}`
    var receiveResult = await prom.instantQuery(receiveQuery);

    //console.log("Transmit result:", transmitResult);
    if (transmitResult.result.length == 0 || receiveResult.result.length == 0){
        console.log("No transmit result for cache:", cache);
        res.status(400).json({ error: "No transmit result" });
        return;
    }
    //console.log(transmitResult.result[0].value.value);
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({ cache: cache, 
        transmit: transmitResult.result[0].value.value,
        receive: receiveResult.result[0].value.value });
  }