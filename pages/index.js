import Head from 'next/head'
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
        <div className="col-span-3 h-screen">
          {/* This is where the map will go */}
          <NRPMap />
        </div>

        <div className="col-span-1 h-screen sidebar-shadow">
          {/* This is where the sidebar will go */}
          <Sidebar />
        </div>

      </div>

    </div>
    
  )
}
