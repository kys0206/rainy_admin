// import {useCallback} from 'react'
// import {useNavigate} from 'react-router-dom'
// import {Modal, ModalContent, ModalAction} from '../../theme/daisyui'
// import {useToggle} from '../../hooks'
// import {useAdmin} from '../../contexts'
// import {Button} from '../../theme/daisyui'

// export default function Logout() {
//   const [open, toggleOpen] = useToggle(true)

//   const navigate = useNavigate()
//   const {logout} = useAdmin()
//   const onAccept = useCallback(() => {
//     logout(() => {
//       toggleOpen()
//       navigate('/')
//     })
//   }, [logout, navigate, toggleOpen])
//   const onCancel = useCallback(() => {
//     toggleOpen()
//     navigate(-1)
//   }, [navigate, toggleOpen])

//   return (
//     <Modal open={open}>
//       <ModalContent
//         closeIconClassName="btn-primary btn-outline"
//         onCloseIconClicked={onCancel}>
//         <p className="text-xl font-bold text-center">로그아웃 하시겠습니까?</p>
//         <ModalAction>
//           <Button className="btn-primary btn-sm" onClick={onAccept}>
//             로그아웃
//           </Button>
//           <Button className="btn-secondary btn-sm" onClick={onCancel}>
//             취소
//           </Button>
//         </ModalAction>
//       </ModalContent>
//     </Modal>
//   )
// }

import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAdmin} from '../../contexts'

export default function Logout() {
  const navigate = useNavigate()
  const {logout} = useAdmin()

  useEffect(() => {
    logout(() => {
      navigate('/')
    })
  }, [logout, navigate])

  return null
}
