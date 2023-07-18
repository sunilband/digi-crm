import { createContext} from 'react'
export interface UserInterface {
  token: string
  email: string
  name: string
}
const userContext = createContext<{
  user: UserInterface | null
  setUser: (newValue: UserInterface | null) => void
}>({
  user: null,
  setUser: () => {},
})

export default userContext
