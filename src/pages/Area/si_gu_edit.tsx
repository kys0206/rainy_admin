import {useEffect, useState, useCallback, ChangeEvent} from 'react'
import {useNavigate, useParams} from 'react-router-dom'

import {post, get} from '../../server'
import {City, SI_GU} from '../../data/types'

const initialFormState: SI_GU = {
  _id: '',
  city_id: '',
  city_name: '',
  si_gu_name: '',
  web_url: ''
}

export default function Si_Gu_EditPage() {
  const [citys, setCitys] = useState<City[]>([])
  const [{si_gu_name, web_url, city_id, city_name}, setForm] =
    useState<SI_GU>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const author = parsedData.name || ''
  const adminId = parsedData.id || ''

  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    get('/area/city/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setCitys(data.body)
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })

    if (id) {
      get(`/area/district/info/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setForm(data.body)
          } else {
            setErrorMessage(data.errorMessage)
          }
        })
        .catch(e => {
          if (e instanceof Error) setErrorMessage(e.message)
        })
    }
  }, [id])

  const changed = useCallback(
    (key: keyof SI_GU) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(prevForm => {
          const updatedForm = {...prevForm, [key]: e.target.value}

          if (key === 'city_id') {
            const selectedCity = citys.find(city => city.id === e.target.value)
            if (selectedCity) {
              updatedForm.city_name = selectedCity.city_name // city_name 연동
              console.log(`ID: ${selectedCity.id}, City Name: ${selectedCity.city_name}`)
            }
          }

          return updatedForm
        })
      },
    [citys]
  )

  const updateCity = useCallback(
    async (
      si_gu_name: string,
      web_url: string,
      city_id: string,
      city_name: string,
      adminId: string,
      author: string
    ) => {
      try {
        const response = await post(`/area/district/edit/${id}`, {
          si_gu_name,
          web_url,
          city_id,
          city_name,
          adminId,
          author
        })
        const data = await response.json()
        if (data.ok) {
          alert('작성이 완료되었습니다.')
          navigate('/area/district/list')
        } else {
          setErrorMessage(data.errorMessage || '시/구 수정에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('시/구 수정 중 오류가 발생했습니다.')
      }
    },
    [navigate]
  )

  const createThema = useCallback(() => {
    updateCity(si_gu_name, web_url, city_id, city_name, adminId, author)
  }, [si_gu_name, web_url, city_id, city_name, adminId, author, updateCity])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      createThema()
    },
    [createThema]
  )

  return (
    <div>
      <div className="bg-lightblue">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">시/구 등록</p>
          </div>
        </div>
      </div>
      <div className="h-screen bg-gray-100">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="p-5 bg-white rounded-xl">
              <div>
                <label
                  htmlFor="countries"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  지역 선택
                </label>
                <select
                  id="countries"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={city_name}
                  onChange={changed('city_id')}>
                  <option value="">전체</option>
                  {citys.map(city => (
                    <option key={city.id} value={city.id}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-5">
                <label className="font-bold">시/구 명</label>
                <input
                  type="text"
                  name="si_gu_name"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="시/구 명을 입력하세요."
                  value={si_gu_name}
                  onChange={changed('si_gu_name')}
                />
              </div>

              <div className="pt-5">
                <label className="font-bold">시/구 관공서 URL</label>
                <input
                  type="text"
                  name="web_url"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="시/구의 관공서의 URL을 입력하세요."
                  value={web_url}
                  onChange={changed('web_url')}
                />
              </div>

              <div className="flex justify-end pt-10">
                <button
                  type="submit"
                  className="w-24 h-8 font-bold text-white border rounded-lg bg-skyblue">
                  등록하기
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
