import { useSelector } from 'react-redux';

export default function GrowingSplit(props) {

  const selectedSite = useSelector((state) => state.selectedSite.value);
  console.log("Growing Split:", selectedSite);

  return (
    <>
      <div className="flex flex-col h-screen">
        <div className="flex-grow basis-2/3">
          {props.top}
        </div>
        <div className={selectedSite ? 'flex-grow basis-1/3' : 'hidden'}>
          {props.bottom}
        </div>
      </div>
    </>
  )
}
