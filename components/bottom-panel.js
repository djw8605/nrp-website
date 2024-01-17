import { useSelector } from 'react-redux';
import useSWR from 'swr';
import sites from '../data/sites.json';
import DataTable from 'react-data-table-component';

const fetcher = (...args) => fetch(...args).then(res => res.json())

/**
 * Format bytes as human-readable text.
 * 
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use 
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * 
 * @return Formatted string.
 */
function humanTransferSpeed(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);


  return bytes.toFixed(dp) + ' ' + units[u] + "/s";
}



export default function BottomPanel() {
  const selectedSite = useSelector((state) => state.selectedSite.value);
  console.log("Sidebar:", selectedSite);
  console.log(sites.sites[selectedSite]);
  const { data: nodesInfo, error } = useSWR(() => '/api/nodesInfo?nodeRegex=' + sites.sites[selectedSite].nodeRegex, fetcher, { refreshInterval: 300000 });
  console.log("Nodes info: ", nodesInfo);
  console.log("Nodes error: ", error);
  const columns = [
    {
      name: 'Node',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Transmit',
      selector: row => row.transmit,
      format: row => humanTransferSpeed(row.transmit),
      sortable: true,
    },
    {
      name: 'Receive',
      format: row => humanTransferSpeed(row.receive),
      selector: row => row.receive,
      sortable: true,
    },
    {
      name: 'Pods',
      selector: row => row.pods,
      sortable: true,
    },
    {
      name: 'GPU Utilization',
      format: row => row.gpuUtilization != undefined ? row.gpuUtilization.toFixed(1) + "%" : "No GPUs",
      selector: row => row.gpuUtilization,
      sortable: true,

    },
  ];

  var data = [];

  if (nodesInfo) {
    Object.keys(nodesInfo).map((name) => {
      console.log("Name: ", name);
      data.push({
        name: name,
        ...nodesInfo[name]
      });
    });
  }

  return (
    <>
      <div className='max-h-[15em] m-2 overflow-auto'>
        <DataTable
          columns={columns}
          data={data}
          dense
        />
      </div>
    </>
  )

}

/*
<div className="bg-white h-full">
        <div className='max-h-[15em] m-2 overflow-auto'>
          <table className="relative w-full text-sm text-left text-gray-500">
            <thead className='text-xs text-gray-700 uppercase dark:text-gray-400'>
              <tr>
                <th scope='col' className="sticky top-0 py-3 px-2 bg-gray-100 dark:bg-gray-700">Node</th>
                <th scope='col' className="sticky top-0 py-3 px-2 bg-gray-100 dark:bg-gray-700">Transmit</th>
                <th scope='col' className="sticky top-0 py-3 px-2 bg-gray-100 dark:bg-gray-700">Receive</th>
                <th scope='col' className="sticky top-0 py-3 px-2 bg-gray-100 dark:bg-gray-700">Pods</th>
              </tr>
            </thead>
            <tbody>
              {nodesInfo && Object.keys(nodesInfo).map((name, info) => {
                return (
                  <tr key={name} className='class="bg-white border-b dark:bg-gray-900 dark:border-gray-700"'>
                    <th scope="row" className="py-2 px-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">{name}</th>
                    <td className='px-2 whitespace-nowrap'>{humanTransferSpeed(nodesInfo[name].transmit)}</td>
                    <td className='px-2 whitespace-nowrap'>{humanTransferSpeed(nodesInfo[name].receive)}</td>
                    <td className='px-2 whitespace-nowrap'>{nodesInfo[name].pods ? nodesInfo[name].pods : "N/A"}</td>
                  </tr>
                );
              })}

            </tbody>
          </table>
        </div>
      </div>
      */