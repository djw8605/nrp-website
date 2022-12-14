import useSWR from 'swr'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';

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


export default function InsideMarker(props) {

  const url = "/api/cacheUtilization?cache=" + props.site.nodeRegex;

  // Update every 60 seconds
  const { data, error } = useSWR(url, fetcher, { refreshInterval: 60 * 1000 });
  if (error) {
    console.log("Error: ", error);
  }
  const [expanded, setExpanded] = useState(false);
  let under;
  if (props.site.cache && (error || (data && data.error))) {
    under = (
      <div className="">To be installed</div>
    );
  } else {
    under = (
      <>
        <FontAwesomeIcon icon={faArrowUp} className="mr-0.5 text-red-600" />
        {
          data
            ? humanTransferSpeed(data.transmit, true, 1)
            : "Loading..."
        }
        <br />
        <FontAwesomeIcon icon={faArrowDown} className="mr-0.5 text-green-600" />
        {
          data
            ? humanTransferSpeed(data.receive, true, 1)
            : "Loading..."
        }
      </>
    )
  }

  return (
    <>
      <div className={`flex flex-col justify-center text-center text-white ${!props.site.cache ? "cursor-pointer transition ease-in-out delay-50 hover:scale-110 duration-300" : ""}`}>
        <div className={`rounded-t-lg bg-gradient-to-r from-slate-600 to-slate-500  py-1 ${!props.site.cache ? "text-xl font-bold px-4" : "text-base px-2"}`}>
          {props.site.shortname}
        </div>
        <div className="justify-center rounded-b-lg bg-gradient-to-r from-slate-800 to-slate-700 px-2 py-1 text-xs ">
          {under}
        </div>
      </div>
    </>
  )
}