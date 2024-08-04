import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {post} from '../../server'

type ThemaFormType = {
  title: string
  content: string
  imgURL: string
}

const initialFormState: ThemaFormType = {
  title: '',
  content: '',
  imgURL: ''
}

export default function EditPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [{title, content, imgURL}, setForm] = useState<ThemaFormType>(initialFormState)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const storedData = window.localStorage.getItem('admin')
  const parsedData = storedData ? JSON.parse(storedData) : {}
  const author = parsedData.name || ''
  const adminId = parsedData.id || ''

  const navigate = useNavigate()

  const changed = useCallback(
    (key: keyof ThemaFormType) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(obj => ({...obj, [key]: e.target.value}))
      },
    []
  )

  const handleImageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    console.log(file)
    if (file) {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setForm(prev => ({...prev, imgURL: reader.result as string}))
      }
    }
  }, [])

  const handleRemoveImage = useCallback(() => {
    setImagePreview(null)
    setForm(prev => ({...prev, imgURL: ''}))
  }, [])

  const addThema = useCallback(
    async (
      title: string,
      content: string,
      imgURL: string,
      adminId: string,
      author: string
    ) => {
      try {
        const response = await post('/thema/upload', {
          title,
          content,
          imgURL,
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
    [navigate]
  )

  const createThema = useCallback(() => {
    addThema(title, content, imgURL, adminId, author)
  }, [title, content, imgURL, adminId, author, addThema])

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      // Additional validation if needed
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
              <div>
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
