import {useState, useEffect} from 'react'
import {MdOutlineEditNote} from 'react-icons/md'
import {useNavigate} from 'react-router-dom'

import {get} from '../../server'
import {City} from '../../data/types'

export default function CityListPage() {
  const [citys, setCitys] = useState<City[]>([])
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const perPage = 10

  const navigate = useNavigate()

  useEffect(() => {
    get('/area/city/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setCitys(data.body)
        } else {
          setErrorMessage(data.errorMesage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage)
      setErrorMessage('')
    }
  }, [errorMessage])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  const indexOfLastItem = currentPage * perPage
  const indexOfFirstItem = indexOfLastItem - perPage
  const currentItems = citys.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(citys.length / perPage)

  const moveAddPage = () => {
    navigate('/area/city/add')
  }

  return (
    <div>
      <div className="bg-lightblue">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">도시 목록</p>
          </div>
        </div>
      </div>
      <div className="h-screen bg-gray-100">
        <div className="p-5">
          <div>
            <input
              className="w-full h-10 p-3 rounded-xl"
              placeholder="검색어를 입력하세요."
            />
          </div>

          <div className="flex justify-end pt-10">
            <button
              className="px-5 py-1 font-bold text-white bg-blue-200 rounded-md hover:bg-blue-400"
              onClick={moveAddPage}>
              추가하기
            </button>
          </div>

          <div className="pt-6">
            <div className="relative overflow-x-auto rounded-xl">
              <table className="w-full text-sm text-left text-gray-500 rtl:text-right dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      INDEX
                    </th>
                    <th scope="col" className="px-6 py-3">
                      CITY_NAME
                    </th>
                    <th scope="col" className="px-6 py-3">
                      AUTHOR
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((city, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="px-6 py-4">{indexOfFirstItem + index + 1}</td>
                      <td className="px-6 py-4">{city.short_name}</td>
                      <td className="px-6 py-4">{city.author}</td>
                      <td className="px-6 py-4">
                        <button
                          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                          onClick={() => navigate(`/area/city/edit/${city._id}`)}>
                          <MdOutlineEditNote className="text-2xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <nav
                className="flex flex-wrap items-center justify-between pt-4 flex-column md:flex-row"
                aria-label="Table navigation">
                <span className="block w-full mb-4 text-sm font-normal text-gray-500 dark:text-gray-400 md:mb-0 md:inline md:w-auto">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, citys.length)}
                  </span>{' '}
                  of{' '}
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {citys.length}
                  </span>
                </span>
                <ul className="inline-flex h-8 pr-1 -space-x-px text-sm rtl:space-x-reverse">
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 ms-0 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      이전
                    </button>
                  </li>
                  {[...Array(totalPages)].map((_, i) => (
                    <li key={i}>
                      <button
                        onClick={() => handlePageChange(i + 1)}
                        className={`flex items-center justify-center h-8 px-3 leading-tight ${
                          currentPage === i + 1
                            ? 'text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                            : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                        }`}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="flex items-center justify-center h-8 px-3 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      다음
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
