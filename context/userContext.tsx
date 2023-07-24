import { createContext} from 'react'
export interface UserInterface {
  token: string
  admin:boolean
  email: string
  name: string
  tasks:[]
  role:string
  authLevel:number
  employeeID:string
  department:string
  manager: {
    name: string
    id: string
  }
  phone:number
  _id:string
}
const userContext = createContext<{
  user: UserInterface | null
  setUser: (newValue: UserInterface | null) => void
}>({
  user: null,
  setUser: () => {},
})

export default userContext
