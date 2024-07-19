export interface IProduct{
  id: number,
  name: string,
  price: number
}

export interface IUser{
  id: number,
  username: string,
  password: string,
  cart: number[]
}
export interface UserDTO{
  id: number,
  username: string,
  cart: number[],
  authToken?: string
}