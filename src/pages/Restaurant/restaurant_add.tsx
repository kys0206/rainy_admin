import type {ChangeEvent} from 'react'
import {useState, useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {get, post} from '../../server'
import {Restaurant} from '../../data/types'

type City = {
  city_name: string
  short_name: string
  id: string
}

type District = {
  city_name: string
  si_gu_name: string
  id: string
}

const initialFormState: Restaurant = {
  _id: '',
  city_id: '',
  city_name: '',
  si_gu_name: '',
  store_name: '',
  address: '',
  contact: '',
  operating_hours: '',
  main_menu: '',
  parking_status: '',
  imgName: '',
  short_info: '',
  store_info: ''
}

export default function RestaurantAddPage() {
  const [citys, setCitys] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [
    {
      city_id,
      si_gu_name,
      store_name,
      address,
      contact,
      operating_hours,
      main_menu,
      parking_status,
      imgName,
      short_info,
      store_info
    },
    setForm
  ] = useState<Restaurant>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const author = parsedData.name || ''
  const adminId = parsedData.id || ''

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

    get('/area/district/list')
      .then(res => res.json())
      .then(data => {
        if (data.ok) {
          setDistricts(data.body)
        } else {
          setErrorMessage(data.errorMessage)
        }
      })
      .catch(e => {
        if (e instanceof Error) setErrorMessage(e.message)
      })
  }, [])

  const changed = useCallback(
    (key: keyof Restaurant) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm(obj => ({...obj, [key]: e.target.value}))
        if (key === 'city_id') {
          const selectedCity = citys.find(city => city.id === e.target.value)
          if (selectedCity) {
            console.log(`ID: ${selectedCity.id}, City Name: ${selectedCity.city_name}`)
          }
        }
      },
    [citys]
  )

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageFile(file)
      setForm(prev => ({...prev, imgName: file.name}))
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null)
    setImageFile(null)
    setForm(prev => ({...prev, imgName: ''}))
  }, [])

  const addRestaurant = useCallback(
    async (
      city_id: string,
      si_gu_name: string,
      store_name: string,
      address: string,
      contact: string,
      operating_hours: string,
      main_menu: string,
      parking_status: string,
      imgName: string,
      short_info: string,
      store_info: string,
      adminId: string,
      author: string
    ) => {
      try {
        let uploadedImageURL = imgName

        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile)

          const uploadResponse = await post('/restaurant/upload', formData)
          const uploadData = await uploadResponse.json()
          console.log(uploadData)

          if (uploadData.success) {
            uploadedImageURL = `${uploadData.imageName}`
          } else {
            setErrorMessage('이미지 업로드에 실패했습니다.')
            return
          }
        }

        const response = await post('/restaurant/add', {
          city_name: city_id,
          si_gu_name,
          store_name,
          address,
          contact,
          operating_hours,
          main_menu,
          parking_status,
          imgName: uploadedImageURL,
          short_info,
          store_info,
          adminId,
          author
        })
        const data = await response.json()
        if (data.ok) {
          alert('작성이 완료되었습니다.')
          navigate('/restaurant/list')
        } else {
          setErrorMessage(data.errorMessage || '맛집 등록에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('맛집 등록 중 오류가 발생했습니다.')
      }
    },
    [navigate, imageFile]
  )

  const createRestaurant = useCallback(() => {
    addRestaurant(
      city_id,
      si_gu_name,
      store_name,
      address,
      contact,
      operating_hours,
      main_menu,
      parking_status,
      imgName,
      short_info,
      store_info,
      adminId,
      author
    )
  }, [
    city_id,
    si_gu_name,
    store_name,
    address,
    contact,
    operating_hours,
    main_menu,
    parking_status,
    imgName,
    short_info,
    store_info,
    adminId,
    author,
    addRestaurant
  ])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Additional validation if needed
      createRestaurant()
    },
    [createRestaurant]
  )

  const filteredDistricts = districts.filter(district => district.city_name === city_id)

  return (
    <div>
      <div className="bg-pink-200">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">맛집 등록</p>
          </div>
        </div>
      </div>
      <div className="h-screen bg-gray-100">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="p-5 bg-white rounded-xl">
              <div>
                <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
                  지역 선택
                </label>
                <select
                  id="cities"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={city_id}
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
                <label className="text-sm font-bold">시/구 선택</label>
                <select
                  id="districts"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={si_gu_name}
                  onChange={changed('si_gu_name')}>
                  <option value="">전체</option>
                  {filteredDistricts.map(district => (
                    <option key={district.id} value={district.si_gu_name}>
                      {district.si_gu_name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-16">
                <label className="text-sm font-bold">가게명</label>
                <input
                  type="text"
                  name="store_name"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="가게명을 입력하세요."
                  value={store_name}
                  onChange={changed('store_name')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">주소</label>
                <input
                  type="text"
                  name="address"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="맛집의 주소를 입력하세요."
                  value={address}
                  onChange={changed('address')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">문의 및 안내</label>
                <input
                  type="text"
                  name="contact"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="문의 및 안내를 위한 연락처를 입력하세요."
                  value={contact}
                  onChange={changed('contact')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">이용시간</label>
                <input
                  type="text"
                  name="operating_hours"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="이용 가능한 시간을 입력하세요."
                  value={operating_hours}
                  onChange={changed('operating_hours')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">대표메뉴</label>
                <input
                  type="text"
                  name="main_menu"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="대표메뉴를 입력하세요."
                  value={main_menu}
                  onChange={changed('main_menu')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">주차여부</label>
                <input
                  type="text"
                  name="parking_status"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="주차여부를 입력하세요."
                  value={parking_status}
                  onChange={changed('parking_status')}
                />
              </div>

              <div className="pt-16">
                <label className="text-sm font-bold">한줄 설명</label>
                <input
                  type="text"
                  name="short_info"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="해당 맛집에 대해 한줄로 설명을 작성하세요."
                  value={short_info}
                  onChange={changed('short_info')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">상세정보</label>
                <textarea
                  name="content"
                  className="w-full h-32 p-3 border rounded-md"
                  placeholder="해당 맛집에 대한 상세정보를 입력하세요."
                  value={store_info}
                  onChange={changed('store_info')}
                />
              </div>

              <div className="flex flex-col pt-5">
                <label className="text-sm font-bold">이미지 추가</label>

                <div className="flex items-center justify-center w-full pt-5">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded Preview"
                        className="object-cover w-full h-64 rounded-lg"
                      />
                      <button
                        onClick={handleRemoveImage}
                        className="absolute p-1 text-white bg-gray-600 rounded-full top-2 right-2">
                        x
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg
                          className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 20 16">
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                          />
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or drag
                          and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                      <input
                        id="dropzone-file"
                        name="food-img"
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>
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
