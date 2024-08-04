import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import * as U from '../utils'
import {post} from '../server'

export type LoggedAdmin = {email: string; password: string; id?: string}
type Callback = () => void

type ContextType = {
  jwt?: string
  errorMessage?: string
  loggedAdmin?: LoggedAdmin
  auth: boolean
  signup: (
    email: string,
    password: string,
    name: string,
    phone: string,
    department: string,
    callback?: Callback
  ) => void
  login: (email: string, password: string, callback?: Callback) => void
  logout: (callback?: Callback) => void
  id?: string
}

export const AdminContext = createContext<ContextType>({
  auth: false,
  signup: (
    email: string,
    password: string,
    name: string,
    department: string,
    phone: string,
    callback?: Callback
  ) => {},
  login: (email: string, password: string, callback?: Callback) => {},
  logout: (callback?: Callback) => {}
})

type AdminProviderProps = {}

export const AdminProvider: FC<PropsWithChildren<AdminProviderProps>> = ({children}) => {
  const [loggedAdmin, setLoggedAdmin] = useState<LoggedAdmin | undefined>(undefined)
  const [jwt, setJwt] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const auth = !!loggedAdmin
  const id = loggedAdmin?.id

  const signup = useCallback(
    (
      email: string,
      password: string,
      name: string,
      phone: string,
      department: string,
      callback?: Callback
    ) => {
      const admin = {email, password, name, phone, department}

      post('/admin/signup', admin)
        .then(res => res.json())
        .then((result: {ok: boolean; body?: string; errorMessage?: string}) => {
          const {ok, body, errorMessage} = result
          if (ok) {
            U.writeStringP('jwt', body ?? '').finally(() => {
              setJwt(body ?? '')
              callback && callback()
            })
          } else setErrorMessage(errorMessage ?? '')
        })
        .catch((e: Error) => setErrorMessage(e.message))
    },
    []
  )

  const login = useCallback((email: string, password: string, callback?: Callback) => {
    const admin = {email, password}
    post('/admin/login', admin)
      .then(res => res.json())
      .then(
        (result: {
          ok: boolean
          body?: string
          id?: string
          name?: string
          errorMessage?: string
        }) => {
          if (result.ok) {
            setLoggedAdmin({email, password, id: result.id})
            setJwt(result.body ?? '')
            U.writeObjectP('admin', {email, id: result.id, name: result.name}).finally(
              () => callback && callback()
            )
          } else {
            setErrorMessage(result.errorMessage ?? '')
          }
        }
      )
      .catch((e: Error) => {
        setErrorMessage(e.message ?? '')
      })
  }, [])

  const logout = useCallback((callback?: Callback) => {
    setJwt(notUsed => '')
    setLoggedAdmin(undefined)
    U.writeObjectP('admin', {})
    callback && callback()
  }, [])

  useEffect(() => {
    const deleteToken = false
    if (deleteToken) {
      U.writeStringP('jwt', '')
        .then(() => {})
        .catch(() => {})
    } else {
      U.readStringP('jwt')
        .then(jwt => setJwt(jwt ?? ''))
        .catch(() => {})

      U.readStringP('admin')
        .then(admin =>
          setLoggedAdmin(
            admin === null ? undefined : admin === '{}' ? undefined : JSON.parse(admin)
          )
        )
        .catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage)
      setErrorMessage(notUsed => '')
    }
  }, [errorMessage])

  const value = {
    jwt,
    errorMessage,
    loggedAdmin,
    auth,
    signup,
    login,
    logout,
    id
  }
  return <AdminContext.Provider value={value} children={children} />
}

export const useAdmin = () => {
  return useContext(AdminContext)
}
