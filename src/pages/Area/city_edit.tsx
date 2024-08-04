import {useEffect, useState, useCallback, ChangeEvent} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {get, post} from '../../server'
import {City} from '../../data/types'

const initialFormState: City = {
  _id: '',
  city_name: '',
  short_name: '',
  imgURL: ''
}

export default function CityEditPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [{city_name, short_name, imgURL}, setForm] = useState<City>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null)

  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const author = parsedData.name || ''
  const adminId = parsedData.id || ''

  const {id} = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (id) {
      get(`/area/city/info/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.ok) {
            setForm(data.body)
            setImagePreview(data.body.imgURL)
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
    (key: keyof City) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
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
      setForm(prev => ({...prev, imgURL: file.name}))
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null)
    setImageFile(null)
    setForm(prev => ({...prev, imgURL: ''}))
  }, [])

  const updateCity = useCallback(
    async (
      city_name: string,
      short_name: string,
      imgURL: string,
      adminId: string,
      author: string
    ) => {
      try {
        let uploadedImageURL = imgURL

        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile)

          const uploadResponse = await post('/area/city/upload', formData)
          const uploadData = await uploadResponse.json()

          if (uploadData.success) {
            uploadedImageURL = `${uploadData.imageName}`
          } else {
            setErrorMessage('이미지 업로드에 실패했습니다.')
            return
          }
        }

        const response = await post(`/area/city/edit/${id}`, {
          city_name,
          short_name,
          imgURL: uploadedImageURL,
          adminId,
          author
        })
        const data = await response.json()
        if (data.ok) {
          alert('수정이 완료되었습니다.')
          navigate('/area/city/list')
        } else {
          setErrorMessage(data.errorMessage || '도시 수정에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('도시 수정 중 오류가 발생했습니다.')
      }
    },
    [navigate, imageFile, id]
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      updateCity(city_name, short_name, imgURL, adminId, author)
    },
    [updateCity, city_name, short_name, imgURL, adminId, author]
  )

  return (
    <div>
      <div className="bg-lightblue">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">도시 수정</p>
          </div>
        </div>
      </div>
      <div className="h-screen bg-gray-100">
        <div className="p-5">
          <form onSubmit={handleSubmit}>
            <div className="p-5 bg-white rounded-xl">
              <div>
                <label className="font-bold">도시명 (풀네임)</label>
                <input
                  type="text"
                  name="city_name"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="도시명(풀네임)을 입력하세요."
                  value={city_name}
                  onChange={changed('city_name')}
                />
              </div>

              <div className="pt-5">
                <label className="font-bold">도시명 (줄임)</label>
                <input
                  name="short_name"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="도시명(줄임)을 입력하세요."
                  value={short_name}
                  onChange={changed('short_name')}
                />
              </div>

              <div className="flex flex-col pt-5">
                <label className="font-bold">이미지 수정</label>

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
                        name="image"
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
                  수정하기
                </button>
              </div>
            </div>
          </form>
          {errorMessage && (
            <div className="mt-5 text-red-500">
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
