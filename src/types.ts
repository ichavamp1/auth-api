export interface Product{
  id: number,
  name: string,
  price: number
}

export interface User{
  id: number,
  username: string,
  password: string,
  cart: number[]
}