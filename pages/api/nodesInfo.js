import { PrometheusDriver } from 'prometheus-query';

const prom = new PrometheusDriver({
    endpoint: "https://prometheus.nrp-nautilus.io/",
    baseURL: "/api/v1", // default value
    timeout: 60000
});

export default async function handler(req, res) {
    //console.log("Got request for cache utilization");
    const url = new URL(req.url, `http://${req.headers.host}`);
    const nodeRegex = url.searchParams.get('nodeRegex');
    if (!nodeRegex) {
        console.log("No cache specified");
        res.status(400).json({ error: "No cache specified" });
        return;
    }

    var transmitQuery = `instance:node_network_transmit_bytes:rate:sum{instance=~"${nodeRegex}"}`
    var receiveQuery = `instance:node_network_receive_bytes:rate:sum{instance=~"${nodeRegex}"}`
    var podQuery = `sum by (node) (kube_pod_info{node=~"${nodeRegex}"})`
    var gpuUtiluzationQuery = `avg by (node) (DCGM_FI_DEV_GPU_UTIL * on (namespace, pod) group_left(node) node_namespace_pod:kube_pod_info:{node=~"${nodeRegex}"})`
    var results = await Promise.all([
        prom.instantQuery(transmitQuery),
        prom.instantQuery(receiveQuery),
        prom.instantQuery(podQuery),
        prom.instantQuery(gpuUtiluzationQuery)
    ]);
    /*
    if (err) {
        console.log("Error:", err);
        res.status(500).json({ error: err });
        return;
    }
    */
    
    var toReturn = {};
    // Loop through each of the results, and add them to the results object

    // Loop through the transmit results
    for (var i = 0; i < results[0].result.length; i++) {
        
        var instance = results[0].result[i].metric.labels.instance;
        toReturn[instance] = {
            transmit: results[0].result[i].value.value
        };
    }
    // Loop through the receive results
    for (var i = 0; i < results[1].result.length; i++) {
        var instance = results[1].result[i].metric.labels.instance;
        if (toReturn[instance]) {
            toReturn[instance].receive = results[1].result[i].value.value;
        } else {
            toReturn[instance] = {
                receive: results[1].result[i].value.value
            };
        }
    }
    // Loop through the pod results
    for (var i = 0; i < results[2].result.length; i++) {
        console.log("Pod result:", results[2].result[i]);
        var instance = results[2].result[i].metric.labels.node;
        if (toReturn[instance]) {
            toReturn[instance].pods = results[2].result[i].value.value;
        } else {
            toReturn[instance] = {
                pods: results[2].result[i].value.value
            };
        }
    }

    // Loop through the gpu utilization results
    for (var i = 0; i < results[3].result.length; i++) {
        console.log("GPU result:", results[3].result[i]);
        var instance = results[3].result[i].metric.labels.node;
        if (toReturn[instance]) {
            toReturn[instance].gpuUtilization = results[3].result[i].value.value;
        } else {
            toReturn[instance] = {
                gpuUtilization: results[3].result[i].value.value
            };
        }
    }

    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate')
    res.setHeader('Content-Type', 'application/json');
    console.log("Results:", toReturn);
    res.status(200).json(toReturn);

}
