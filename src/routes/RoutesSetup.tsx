import {Routes, Route, Navigate, Outlet} from 'react-router-dom'
import RequireAuth from './Auth/RequireAuth'
import {useAdmin} from '../contexts'

import Signup from './Auth/SignUp'
import Login from './Auth/Login'
import Logout from './Auth/Logout'

import NoMatch from './NoMatch'
import Home from '../pages/Home/home'
import ThemaPage from '../pages/Thema/thema'

import Layout from './Layout'
import AddPage from '../pages/Thema/add'

import CityAddPage from '../pages/Area/city_add'
import CityListPage from '../pages/Area/city_list'
import Si_Gu_AddPage from '../pages/Area/si_gu_add'
import Si_Gu_ListPage from '../pages/Area/si_gu_list'
import TripAddPage from '../pages/Trip/trip_add'
import TripListPage from '../pages/Trip/trip_list'
import RestaurantAddPage from '../pages/Restaurant/restaurant_add'
import FestivalAddPage from '../pages/Festival/festival_add'
import FestivalListPage from '../pages/Festival/festival_list'
import CityEditPage from '../pages/Area/city_edit'
import Si_Gu_EditPage from '../pages/Area/si_gu_edit'
import RestaurantListPage from '../pages/Restaurant/restaurant_list'
import EditPage from '../pages/Thema/edit'
import TripEditPage from '../pages/Trip/trip_edit'
import FestivalEditPage from '../pages/Festival/festival_edit'
import RestaurantEditPage from '../pages/Restaurant/restaurant_edit'

export default function RoutesSetup() {
  const {auth, id} = useAdmin() // auth 상태 가져오기
  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const sid = parsedData.id
  // console.log('auth: ', auth)
  // console.log('sid: ', sid)

  return (
    <div className="text-black font-pretendar">
      <Routes>
        {!sid ? (
          <>
            <Route index element={<Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
          </>
        ) : (
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/thema/list" element={<ThemaPage />} />
            <Route path="/thema/add" element={<AddPage />} />
            <Route path="/thema/edit/:id" element={<EditPage />} />

            <Route path="/area/city/add" element={<CityAddPage />} />
            <Route path="/area/city/list" element={<CityListPage />} />
            <Route path="/area/city/edit/:id" element={<CityEditPage />} />

            <Route path="/area/district/add" element={<Si_Gu_AddPage />} />
            <Route path="/area/district/list" element={<Si_Gu_ListPage />} />
            <Route path="/area/district/edit/:id" element={<Si_Gu_EditPage />} />

            <Route path="/trip/add" element={<TripAddPage />} />
            <Route path="/trip/list" element={<TripListPage />} />
            <Route path="/trip/edit/:id" element={<TripEditPage />} />

            <Route path="/festival/add" element={<FestivalAddPage />} />
            <Route path="/festival/list" element={<FestivalListPage />} />
            <Route path="/festival/edit/:id" element={<FestivalEditPage />} />

            <Route path="/restaurant/add" element={<RestaurantAddPage />} />
            <Route path="/restaurant/list" element={<RestaurantListPage />} />
            <Route path="/restaurant/edit/:id" element={<RestaurantEditPage />} />
            <Route
              path="logout"
              element={
                <RequireAuth>
                  <Logout />
                </RequireAuth>
              }
            />
          </Route>
        )}
        <Route path="*" element={<NoMatch />} />
      </Routes>
    </div>
  )
}
