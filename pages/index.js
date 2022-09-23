import Head from 'next/head'
import BottomPanel from '../components/bottom-panel'
import GrowingSplit from '../components/growing-split'
import NRPMap from '../components/nrp-map'
import Sidebar from '../components/sidebar'

export default function Home() {
  return (
    <div className="">
      <Head>
        <title>Prototype National Research Platform</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="grid grid-cols-4">
        <div className='col-span-3'>
          <GrowingSplit top={<NRPMap />} bottom={<BottomPanel />} />
        </div>

        <div className="col-span-1 h-screen sidebar-shadow">
          {/* This is where the sidebar will go */}
          <Sidebar />
        </div>

      </div>

    </div>

  )
}
