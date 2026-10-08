export interface UserProfile {
  id: string
  name: string
  email: string
  image: string | null
  phoneNumber: string
  dateOfBirth: string | null
  isVolunteer: boolean
  createAt?: string | null
}