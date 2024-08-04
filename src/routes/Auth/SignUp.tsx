import type {ChangeEvent} from 'react'
import {useState, useCallback} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAdmin} from '../../contexts'

type SignUpFormType = Record<
  'email' | 'password' | 'confirmPassword' | 'name' | 'department' | 'phone',
  string
>

const initialFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  department: '',
  phone: ''
}

export default function SignUp() {
  const [{email, password, confirmPassword, name, phone, department}, setForm] =
    useState<SignUpFormType>(initialFormState)
  const changed = useCallback(
    (key: string) => (e: ChangeEvent<HTMLInputElement>) => {
      setForm(obj => ({...obj, [key]: e.target.value}))
    },
    []
  )

  const navigate = useNavigate()
  const {signup} = useAdmin()
  const createAccount = useCallback(() => {
    console.log(email, password, name, phone, department)
    if (password === confirmPassword) {
      signup(email, password, name, phone, department, () => navigate('/'))
    } else alert('비밀번호가 일치하지 않습니다. 다시 입력하세요')
  }, [confirmPassword, email, navigate, password, name, phone, department, signup])

  return (
    <div className="pt-20">
      <div className="flex flex-col items-center justify-center flex-1 max-w-sm px-2 mx-auto">
        <div className="">
          <div className="flex justify-center item-center">
            <p className="text-3xl font-bold">회원가입</p>
          </div>
          <div className="flex justify-center pt-10 item-center">
            <div>
              <div className="pb-6">
                <label className="block text-sm font-bold w-80">이메일 주소</label>
                <input
                  type="text"
                  className="w-full py-2 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="email"
                  placeholder="예) rainy@rainy.co.kr"
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
              <div className="mb-6">
                <label className="block text-sm font-bold">비밀번호 확인</label>
                <input
                  type="password"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="confirm_password"
                  value={confirmPassword}
                  onChange={changed('confirmPassword')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">이름</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="name"
                  value={name}
                  onChange={changed('name')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">연락처</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="phone"
                  value={phone}
                  onChange={changed('phone')}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-bold">부서</label>
                <input
                  type="text"
                  className="w-full py-2 mb-3 leading-tight border-b-2 focus:outline-none focus:border-b-cyan-950"
                  name="department"
                  value={department}
                  onChange={changed('department')}
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 font-bold text-white bg-gray-200 rounded-xl hover:bg-black focus:outline-none focus:shadow-outline"
                onClick={createAccount}>
                가입하기
              </button>
            </div>
          </div>

          <div className="mt-6 text-grey-dark">
            이미 계정이 있나요?
            <Link className="pl-4 btn btn-link btn-primary" to="/login/">
              로그인
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
