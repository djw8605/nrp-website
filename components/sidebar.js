import { useSelector, useDispatch } from 'react-redux';
import { updateSite } from '../src/selectedSite';
import sites from '../data/sites.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faGlobe, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import { useMemo } from 'react';



export default function Sidebar() {
  const selectedSite = useSelector((state) => state.selectedSite.value);
  console.log("Sidebar:", selectedSite);
  console.log(sites.sites[selectedSite]);
  const dispatch = useDispatch();

  const website = selectedSite ? sites.sites[selectedSite].website : "https://nationalresearchplatform.org";

  const siteLinks = useMemo(() => {
    return Object.keys(sites.sites).map((site) => {
      return (
        <div key={site} className="m-2 flex flex-row items-center rounded-md border-2 border-slate-300 p-2 justify-between cursor-pointer hover:border-blue-500 active:ring active:border-blue-700"
          onClick={() => {dispatch(updateSite(site))}}>
          <div className="mr-4 flex flex-row items-center">
            <div>
              {/* <!-- Add icon here --> */}
            </div>
            <div>
              <div className="text-xl font-bold">{sites.sites[site].shortname}</div>
              <div className="text-sm text-gray-600">{sites.sites[site].name}</div>
            </div>
            
          </div>
          <div className="mr-4">
            <FontAwesomeIcon icon={faChevronRight} />
          </div>
        </div>
      );
    });
  });

  return (
    <>
      <div className="bg-white h-full">
        <div className="p-2">
          <img src="/images/NRP_LOGO-cropped.svg" />
        </div>

        <div className="h-full">

          {selectedSite && sites.sites[selectedSite] &&
            <img className='shadow-inner' src={sites.sites[selectedSite].image} />}
          {!selectedSite && <img className='shadow-inner' src="/images/NRP_globe_1600.jpg" />}
          <h1 className="text-lg font-bold p-2 ">
            {selectedSite && selectedSite}
            {!selectedSite && "Prototype National Research Platform"}
          </h1>
          <div className="grid grid-cols-3 divide-x text-center">
            <div className="hover:text-blue-500 cursor-pointer">
              <a href={website}>
                <div className="font-bold text-lg">
                  <FontAwesomeIcon icon={faGlobe} />
                </div>
                <div className="text-sm">
                  Website
                </div>
              </a>
            </div>
            <div className="hover:text-blue-500">
              <div className="font-bold text-lg">
                {selectedSite && sites.sites[selectedSite] && sites.sites[selectedSite].num_gpus}
                {!selectedSite && "300+"}
              </div>
              <div className="text-sm">
                GPUs
              </div>
            </div>
            <div className="hover:text-blue-500">
              <div className="font-bold text-lg">
                {selectedSite && sites.sites[selectedSite] && sites.sites[selectedSite].num_cpus}
                {!selectedSite && "3000+"}
              </div>
              <div className="text-sm">
                CPUs
              </div>
            </div>
          </div>
          <div className="py-2 px-2 h-full border-t-2 mt-4">
            <p className=''>
              {selectedSite && sites.sites[selectedSite] && sites.sites[selectedSite].summary}
            </p>
            {!selectedSite && siteLinks}
          </div>
        </div>

      </div>

    </>
  )
}
