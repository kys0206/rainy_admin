import {Provider as ReduxProvider} from 'react-redux'
import {BrowserRouter} from 'react-router-dom'
import {AdminProvider, ThemaProvider} from './contexts'
import RoutesSetup from './routes/RoutesSetup'
import {useStore} from './store'

export default function App() {
  const store = useStore()
  return (
    <ReduxProvider store={store}>
      <BrowserRouter>
        <AdminProvider>
          <RoutesSetup />
        </AdminProvider>
      </BrowserRouter>
    </ReduxProvider>
  )
}
