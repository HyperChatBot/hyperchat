export interface UserInfo {
  email: string
  email_verified: true
  family_name: string
  given_name: string
  name: string
  preferred_username: string
  profile: string
  sub: string
}

export enum Roles {
  ADMIN = 'ROLE_ADMIN',
  CUSTOMER = 'ROLE_CUSTOMER'
}
