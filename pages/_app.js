/* pages/_app.js */
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Link from 'next/link'

function MyApp({ Component, pageProps }) {
  return (
    <div className="container">
    <div>
      <div className='text-center'>
      <img src="/1.png" style={{ width: "40%", height: "150px"}} alt="Image 1" className='rounded d-inline-block align-top'></img>
    </div>
      <div className="text-center mt-6" style={{ display: "flex", justifyContent: "space-evenly"}}>
        {/* <img src="./Marketplace_logo.png"  style={{ display: "block", margin: "auto" }}></img> */}
        <img src="/Marketplace_logo.png" style={{ width: "50%",  height: "120px",marginLeft: "10px" }} alt="Image 2"></img>
    </div>


      <nav className="navbar navbar-expand-lg border-b p-6">
          <div className="container-fluid">
            <ul className="navbar-nav">
              <li className="navbar-item">
                <Link legacyBehavior href="/">
                    <a className="mr-4 text-2xl font-bold text-blue-500">Home</a>
                </Link>
              </li>
              <li className="navbar-item">
                <Link legacyBehavior href="/create-nft">
                    <a className="mr-4 font-bold text-2xl text-blue-500">Create NFT</a>
                </Link>
              </li>
              <li className="navbar-item">
                <Link legacyBehavior href="/dashboard">
                    <a className="mr-4 font-bold text-2xl text-blue-500">Dashboard</a>
                </Link>
              </li>
            </ul>
        </div>
      </nav>
      
      <Component {...pageProps} />
    </div>
    </div>
  )
}

export default MyApp