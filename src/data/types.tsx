export type Slide = {
  _id: string
  id: string
  isPublic: boolean
  title: string
  content: string
  imgName: string
  author?: string
}

export type City = {
  _id: string
  id: string
  city_name: string
  short_name: string
  imgName: string
  author?: string
}

export type District = {
  id: string
  city_id: string
  city_name: string
  si_gu_name: string
  place_name: string
  web_url: string
}

export type SI_GU = {
  _id: string
  city_id: string
  city_name: string
  si_gu_name: string
  web_url: string
  author?: string
}

export type Thema = {
  _id: string
  isPublic: boolean
  title: string
  content: string
  imgName: string
  author?: string
}

export type Trip = {
  _id: string
  city_id: string
  city_name: string
  si_gu_name: string
  place_name: string
  imgName: string
  address: string
  contact: string
  operating_hours: string
  entrace_fee: string
  parking_status: string
  web_url: string
  short_info: string
  place_info: string
  author?: string
}

export type Restaurant = {
  _id: string
  city_id: string
  city_name: string
  si_gu_name: string
  store_name: string
  address: string
  contact: string
  operating_hours: string
  main_menu: string
  parking_status: string
  imgName: string
  short_info: string
  store_info: string
  author?: string
}

export type Festival = {
  _id: string
  id: string
  isPublic: boolean
  city_id: string
  city_name: string
  si_gu_name: string
  status: boolean // 진행중 / 종료
  title: string
  festival_period: string // 축제기간
  festival_info: string
  content: string
  address: string
  entrace_fee: string // 이용요금
  contact: string
  imgName: string
  web_url: string
  author?: string
}
