import type {ChangeEvent} from 'react'
import {useState, useCallback, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {post, get} from '../../server'
import {City, District, Festival} from '../../data/types'

const initialFormState: Festival = {
  _id: '',
  id: '',
  isPublic: true,
  city_id: '',
  city_name: '',
  si_gu_name: '',
  status: true,
  title: '',
  festival_period: '',
  festival_info: '',
  content: '',
  address: '',
  entrace_fee: '',
  contact: '',
  imgName: '',
  web_url: ''
}

export default function FestivalAddPage() {
  const [citys, setCitys] = useState<City[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [
    {
      isPublic,
      city_id,
      si_gu_name,
      status,
      title,
      festival_period,
      festival_info,
      content,
      address,
      entrace_fee,
      contact,
      imgName,
      web_url
    },
    setForm
  ] = useState<Festival>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null) // 파일 객체 상태 추가

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
    (key: keyof Festival) =>
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

  const handlePublicChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setForm(prev => ({...prev, isPublic: isChecked}))
  }, [])

  const handleStatusChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setForm(prev => ({...prev, status: isChecked}))
  }, [])

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setImageFile(file) // 파일 객체를 상태에 저장
      setForm(prev => ({...prev, imgName: file.name})) // 파일 이름을 상태에 저장
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null)
    setImageFile(null) // 파일 객체 상태 초기화
    setForm(prev => ({...prev, imgName: ''}))
  }, [])

  const addFestival = useCallback(
    async (
      isPublic: boolean,
      city_id: string,
      si_gu_name: string,
      status: boolean,
      title: string,
      festival_period: string,
      festival_info: string,
      content: string,
      address: string,
      entrace_fee: string,
      contact: string,
      imgName: string,
      web_url: string,
      adminId: string,
      author: string
    ) => {
      try {
        let uploadedImageURL = imgName

        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile) // 파일 추가

          const uploadResponse = await post('/festival/upload', formData)
          const uploadData = await uploadResponse.json()
          console.log(uploadData)

          if (uploadData.success) {
            uploadedImageURL = `${uploadData.imageName}`
          } else {
            setErrorMessage('이미지 업로드에 실패했습니다.')
            return
          }
        }

        const response = await post('/festival/add', {
          isPublic,
          city_name: city_id,
          si_gu_name,
          status,
          title,
          festival_period,
          festival_info,
          content,
          address,
          entrace_fee,
          contact,
          imgName: uploadedImageURL,
          web_url,
          adminId,
          author
        })
        const data = await response.json()
        if (data.ok) {
          alert('작성이 완료되었습니다.')
          navigate('/festival/list')
        } else {
          setErrorMessage(data.errorMessage || '축제 등록에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('축제 등록 중 오류가 발생했습니다.')
      }
    },
    [navigate, imageFile]
  )

  const createFestival = useCallback(() => {
    addFestival(
      isPublic,
      city_id,
      si_gu_name,
      status,
      title,
      festival_period,
      festival_info,
      content,
      address,
      entrace_fee,
      contact,
      imgName,
      web_url,
      adminId,
      author
    )
  }, [
    isPublic,
    city_id,
    si_gu_name,
    status,
    title,
    festival_period,
    festival_info,
    content,
    address,
    entrace_fee,
    contact,
    imgName,
    web_url,
    adminId,
    author,
    addFestival
  ])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      createFestival()
    },
    [createFestival]
  )

  // 선택한 도시 ID에 따른 시/구 목록 필터링
  const filteredDistricts = districts.filter(district => district.city_name === city_id)

  return (
    <div>
      <div className="bg-lightblue">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">축제 등록</p>
          </div>
        </div>
      </div>
      <div className="h-screen bg-gray-100">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="p-5 bg-white rounded-xl">
              <div className="pt-5">
                <label className="font-bold">공개여부</label>
                <div className="flex items-center pt-2">
                  <span className="mr-3 text-sm font-medium text-gray-600 ">비공개</span>
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={isPublic}
                      onChange={handlePublicChange}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0  rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
                  </label>
                  <span className="ml-3 text-sm font-medium text-gray-600 ">공개</span>
                </div>
              </div>

              <div className="pt-5">
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

              <div className="pt-5">
                <label className="text-sm font-bold">축제 상태</label>
                <div className="flex items-center pt-2">
                  <span className="mr-3 text-sm font-medium text-gray-600 ">
                    축제 미진행중
                  </span>
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      value=""
                      className="sr-only peer"
                      checked={status}
                      onChange={handleStatusChange}
                    />
                    <div className="w-9 h-5 bg-gray-200 hover:bg-gray-300 peer-focus:outline-0  rounded-full peer transition-all ease-in-out duration-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600 hover:peer-checked:bg-indigo-700 "></div>
                  </label>
                  <span className="ml-3 text-sm font-medium text-gray-600 ">
                    축제 진행중
                  </span>
                </div>
              </div>

              <div className="pt-16">
                <label className="text-sm font-bold">축제명</label>
                <input
                  type="text"
                  name="title"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="축제 장소명을 입력하세요."
                  value={title}
                  onChange={changed('title')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">주소</label>
                <input
                  type="text"
                  name="address"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="축제의 주소를 입력하세요."
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
                <label className="text-sm font-bold">축제 기간</label>
                <input
                  type="text"
                  name="festival_period"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="축제 기간을 입력하세요."
                  value={festival_period}
                  onChange={changed('festival_period')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">이용요금</label>
                <input
                  type="text"
                  name="entrace_fee"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="해당 축제의 이용요금을 입력하세요."
                  value={entrace_fee}
                  onChange={changed('entrace_fee')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">웹사이트 URL</label>
                <input
                  type="text"
                  name="web_url"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="해당 축제의 웹사이트 URL을 입력하세요."
                  value={web_url}
                  onChange={changed('web_url')}
                />
              </div>

              <div className="pt-16">
                <label className="text-sm font-bold">한줄 설명</label>
                <input
                  type="text"
                  name="festival_info"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="해당 축제에 대해 한줄로 설명을 작성하세요."
                  value={festival_info}
                  onChange={changed('festival_info')}
                />
              </div>

              <div className="pt-5">
                <label className="text-sm font-bold">상세정보</label>
                <textarea
                  name="content"
                  className="w-full h-32 p-3 border rounded-md"
                  placeholder="해당 축제에 대한 상세정보를 입력하세요."
                  value={content}
                  onChange={changed('content')}
                />
              </div>

              <div className="flex flex-col pt-5">
                <label className="font-bold">이미지 추가</label>

                <div className="flex items-center justify-center w-full pt-5">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Uploaded Preview"
                        className="object-cover w-full h-64 rounded-lg"
                      />
                      <button
                        type="button"
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
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
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
                        name="trip"
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
