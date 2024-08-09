//import {Link} from 'react-router-dom'
import {Link as RRLink, NavLink} from 'react-router-dom'

// icon
import {PiMapPinAreaDuotone, PiAirplaneInFlightDuotone} from 'react-icons/pi'
import {RiRestaurantFill} from 'react-icons/ri'
import {MdCardTravel, MdOutlineFestival} from 'react-icons/md'

import {Link} from '../../components'

export default function NavigationBar() {
  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const adminName = parsedData.name
  const adminEmail = parsedData.email

  return (
    <div className="flex flex-col p-3 text-center w-52">
      <div className="flex items-center logo">
        <Link to="/" className="btn btn-link">
          <img className="w-40" src="/assets/images/logo.png" />
        </Link>
      </div>

      <div className="pt-16">
        <div className="flex items-center justify-center">
          <img
            className=""
            src="/assets/images/icon/profile_icon.png"
            width="100"
            height="auto"
          />
        </div>
        <p>{adminName}</p>
        <p>{adminEmail}</p>
      </div>

      <div className="flex items-center justify-center pt-5">
        <RRLink to="" className="pl-4 pr-4">
          <img
            className=""
            src="/assets/images/icon/icon_header_profile1.png"
            width="17"
            height="auto"
          />
        </RRLink>

        <RRLink
          to=""
          className="pl-4 pr-4"
          style={{
            borderLeft: '1px solid #e3dede',
            borderRight: '1px solid #e3dede'
          }}>
          <img
            className=""
            src="/assets/images/icon/lock_icon.png"
            width="17"
            height="auto"
          />
        </RRLink>

        <RRLink to="/logout" className="pl-4 pr-4">
          <img
            className=""
            src="/assets/images/icon/logout.png"
            width="17"
            height="auto"
          />
        </RRLink>
      </div>

      <div className="pt-20">
        <div className="">
          <details className="group">
            <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span>
                <MdCardTravel />
              </span>
              <span className="flex gap-2">
                <span>테마</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </summary>

            <article className="px-4 pb-4">
              <ul className="flex flex-col gap-1 pl-2">
                <li>
                  <NavLink
                    to="/thema/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    목록
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/thema/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    등록
                  </NavLink>
                </li>
              </ul>
            </article>
          </details>
        </div>

        <div className="pt-4">
          <details className="group">
            <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span>
                <PiAirplaneInFlightDuotone />
              </span>
              <span className="flex gap-2">
                <span>여행정보</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </summary>

            <article className="px-4 pb-4">
              <ul className="flex flex-col gap-1 pl-2">
                <li>
                  <NavLink
                    to="/trip/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    여행지 목록
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/trip/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    여행지 등록
                  </NavLink>
                </li>
              </ul>
            </article>
          </details>
        </div>

        <div className="pt-4">
          <details className="group">
            <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span>
                <PiMapPinAreaDuotone />
              </span>
              <span className="flex gap-2">
                <span>지역</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </summary>

            <article className="px-4 pb-4">
              <ul className="flex flex-col gap-1 pl-2">
                <li>
                  <NavLink
                    to="/area/city/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    도시 목록
                  </NavLink>
                </li>
                <li className="pb-5">
                  <NavLink
                    to="/area/city/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    도시 등록
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/area/district/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    시/구 목록
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/area/district/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    시/구 등록
                  </NavLink>
                </li>
              </ul>
            </article>
          </details>
        </div>

        <div className="pt-4">
          <details className="group">
            <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span>
                <MdOutlineFestival />
              </span>
              <span className="flex gap-2">
                <span>축제</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </summary>

            <article className="px-4 pb-4">
              <ul className="flex flex-col gap-1 pl-2">
                <li>
                  <NavLink
                    to="/festival/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    축제 목록
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/festival/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    축제 등록
                  </NavLink>
                </li>
              </ul>
            </article>
          </details>
        </div>

        <div className="pt-4">
          <details className="group">
            <summary className="flex items-center justify-between gap-2 p-2 font-medium marker:content-none hover:cursor-pointer">
              <span>
                <RiRestaurantFill />
              </span>
              <span className="flex gap-2">
                <span>맛집</span>
              </span>
              <svg
                className="w-5 h-5 text-gray-500 transition group-open:rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"></path>
              </svg>
            </summary>

            <article className="px-4 pb-4">
              <ul className="flex flex-col gap-1 pl-2">
                <li>
                  <NavLink
                    to="/restaurant/list"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    맛집 목록
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/restaurant/add"
                    className={({isActive}) =>
                      `block ${isActive ? 'font-bold text-blue-700' : ''}`
                    }>
                    맛집 등록
                  </NavLink>
                </li>
              </ul>
            </article>
          </details>
        </div>
      </div>
    </div>
  )
}
