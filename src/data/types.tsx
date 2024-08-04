export type City = {
  _id: string
  city_name: string
  short_name: string
  imgURL: string
  author?: string
}

export type District = {
  id: string
  city_name: string
  si_gu_name: string
  place_name: string
  web_url: string
}

export type SI_GU = {
  city_id: string
  city_name: string
  si_gu_name: string
  web_url: string
  author?: string
}

export type Thema = {
  title: string
  content: string
  imgURL: string
  author?: string
}

export type Trip = {
  _id: string
  city_name: string
  si_gu_name: string
  place_name: string
  imgName: string
  web_url: string
  short_info: string
}

export type Restaurant = {
  _id: string
  city_name: string
  si_gu_name: string
  store_name: string
  imgURL: string
  short_info: string
}

export type Festival = {
  id: string
  city_id: string
  city_name: string
  si_gu_name: string
  status: string // 진행중 / 종료
  title: string
  festival_period: string // 축제기간
  content: string
  address: string
  entrace_fee: string // 이용요금
  contact: string
  imgName: string
  web_url: string
}
