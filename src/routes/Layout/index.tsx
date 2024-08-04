import {Outlet} from 'react-router-dom'
import NavigationBar from './NavigationBar'

export default function Layout() {
  return (
    <div className="flex">
      <div className="w-52">
        <NavigationBar />
      </div>
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  )
}
