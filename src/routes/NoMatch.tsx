import {useCallback} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from '../theme/daisyui'

export default function NoMatch() {
  const navigate = useNavigate()

  const goBack = useCallback(() => {
    navigate(-1)
  }, [navigate])

  return (
    <div className="flex flex-col items-center justify-center pt-52">
      <p className="text-center text-7xl alert alert-error text-skyblue">404 ERROR</p>
      <p className="pt-4 text-3xl text-center alert alert-error">Page Not Found</p>
      <div className="flex justify-center pt-10">
        <Button className="p-2 pl-5 pr-5 border rounded-lg" onClick={goBack}>
          뒤로가기
        </Button>
      </div>
    </div>
  )
}
