import { useSelector, useDispatch } from 'react-redux';
import { updateSite } from '../src/selectedSite';
import sites from '../data/sites.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'



export default function Sidebar() {
  const selectedSite = useSelector((state) => state.selectedSite.value);
  console.log("Sidebar:", selectedSite);
  console.log(sites.sites[selectedSite]);

  return (
    <>
      <div className="bg-slate-200 h-full">
        <div className="p-2">
          <img src="/images/NRP_LOGO-cropped.svg" />
        </div>

        <div className="h-full">

          {selectedSite && sites.sites[selectedSite] &&
            <img className='' src={sites.sites[selectedSite].image} />}
          <h1 className="text-lg font-bold p-2 bg-slate-800 text-white">
            {selectedSite}
          </h1>
          <div className="py-2 px-2 bg-teal-800 h-full">
            <p className='text-white'>
              {selectedSite && sites.sites[selectedSite] && sites.sites[selectedSite].summary}
            </p>
            <a href={selectedSite && sites.sites[selectedSite] && sites.sites[selectedSite].website}>
              <button className="mt-4 rounded-md bg-green-600 p-2 text-white hover:scale-110 ">Visit {sites.sites[selectedSite].shortname}
                <FontAwesomeIcon className='ml-1' icon={faArrowRight} /></button>
            </a>
          </div>
        </div>

      </div>

    </>
  )
}
