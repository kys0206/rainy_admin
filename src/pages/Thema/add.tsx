import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {post} from '../../server'
import {Thema} from '../../data/types'

const initialFormState: Thema = {
  _id: '',
  isPublic: true,
  title: '',
  content: '',
  imgName: ''
}

export default function AddPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [{isPublic, title, content, imgName}, setForm] = useState<Thema>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [imageFile, setImageFile] = useState<File | null>(null) // 파일 객체 상태 추가

  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const author = parsedData.name || ''
  const adminId = parsedData.id || ''

  const navigate = useNavigate()

  const changed = useCallback(
    (key: keyof Thema) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const handlePublicChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked
    setForm(prev => ({...prev, isPublic: isChecked}))
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

  const addThema = useCallback(
    async (
      isPublic: boolean,
      title: string,
      content: string,
      imgName: string,
      adminId: string,
      author: string
    ) => {
      try {
        let uploadedImageURL = imgName

        if (imageFile) {
          const formData = new FormData()
          formData.append('image', imageFile) // 파일 추가

          const uploadResponse = await post('/thema/upload', formData)
          const uploadData = await uploadResponse.json()
          console.log(uploadData)

          if (uploadData.success) {
            uploadedImageURL = `${uploadData.imageName}`
          } else {
            setErrorMessage('이미지 업로드에 실패했습니다.')
            return
          }
        }

        const response = await post('/thema/add', {
          isPublic,
          title,
          content,
          imgName: uploadedImageURL,
          adminId,
          author
        })
        const data = await response.json()
        if (data.ok) {
          alert('작성이 완료되었습니다.')
          navigate('/thema/list')
        } else {
          setErrorMessage(data.errorMessage || '테마 등록에 실패했습니다.')
        }
      } catch (error) {
        setErrorMessage('테마 등록 중 오류가 발생했습니다.')
      }
    },
    [navigate, imageFile]
  )

  const createThema = useCallback(() => {
    addThema(isPublic, title, content, imgName, adminId, author)
  }, [isPublic, title, content, imgName, adminId, author, addThema])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      createThema()
    },
    [createThema]
  )

  return (
    <div>
      <div className="bg-yellow-300">
        <div className="p-3">
          <div>
            <p className="text-xl font-bold">테마 등록</p>
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
                <label className="font-bold">제목</label>
                <input
                  type="text"
                  name="title"
                  className="w-full h-10 p-3 border rounded-md"
                  placeholder="제목을 입력하세요."
                  value={title}
                  onChange={changed('title')}
                />
              </div>

              <div className="pt-5">
                <label className="font-bold">내용</label>
                <textarea
                  name="content"
                  className="w-full h-32 p-3 border rounded-md"
                  placeholder="내용을 입력하세요."
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
                        name="thema"
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
