import type {ChangeEvent} from 'react'
import {useState, useCallback, useEffect} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAdmin} from '../../contexts'
import * as U from '../../utils'

type LoginFormType = Record<'email' | 'password', string>
const initialFormState = {email: '', password: ''}

export default function Login() {
  const [{email, password}, setForm] = useState<LoginFormType>(initialFormState)
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {login} = useAdmin()
  const loginAccount = useCallback(() => {
    login(email, password, () => navigate('/'))
  }, [email, login, navigate, password])

  useEffect(() => {
    U.readObjectP<LoginFormType>('admin')
      .then(admin => {
        if (admin) setForm(admin)
      })
      .catch(e => {})
  }, [])

  return (
    <div className="pt-40">
      <div className="">
        <div className="flex justify-center item-center">
          <div className="">
            <img src="/assets/images/title.png" width="150px" />
            <p className="text-center text-2xl font-bold">관리자 페이지</p>
          </div>
        </div>
        <div className="flex justify-center pt-20 item-center">
          <div className="">
            <div className="pb-6">
              <label className="block text-sm font-bold">이메일 주소</label>
              <input
                type="text"
                className="w-full py-2 leading-tight placeholder-gray-300 border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="email"
                value={email}
                onChange={changed('email')}
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-bold">비밀번호</label>
              <input
                type="password"
                className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                name="password"
                value={password}
                onChange={changed('password')}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gray-800 rounded-xl focus:outline-none focus:shadow-outline"
              onClick={loginAccount}>
              로그인
            </button>

            <div className="flex items-center justify-between pt-5 pb-10">
              <Link to="/signup" className="text-sm px-7">
                이메일 가입
              </Link>

              <Link
                to="/login/find_email"
                className="text-sm px-7"
                style={{
                  borderRight: '1px solid #e3dede',
                  borderLeft: '1px solid #e3dede'
                }}>
                이메일 찾기
              </Link>

              <Link to="/login/find_password" className="text-sm px-7">
                비밀번호 찾기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
