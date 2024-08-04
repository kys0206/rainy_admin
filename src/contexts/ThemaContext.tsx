import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect
} from 'react'
import {post} from '../server'

type Callback = () => void

type ContextType = {
  errorMessage?: string
  addThema: (title: string, content: string, callback?: Callback) => void
  id?: string
}

export const ThemaContext = createContext<ContextType>({
  addThema: (title: string, content: string, callback?: Callback) => {}
})

type ThemaProviderProps = {}

export const ThemaProvider: FC<PropsWithChildren<ThemaProviderProps>> = ({children}) => {
  const [errorMessage, setErrorMessage] = useState<string>('')

  const addThema = useCallback((title: string, content: string, callback?: Callback) => {
    const thema = {title, content}
    console.log(thema)

    post('/thema/add', thema)
      .then(res => res.json())
      .catch((e: Error) => setErrorMessage(e.message))
  }, [])

  useEffect(() => {
    if (errorMessage) {
      alert(errorMessage)
      setErrorMessage(notUsed => '')
    }
  }, [errorMessage])

  const value = {
    errorMessage,
    addThema
  }
  return <ThemaContext.Provider value={value} children={children} />
}

export const useThema = () => {
  return useContext(ThemaContext)
}
