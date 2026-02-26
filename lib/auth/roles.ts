export type UserRole = 'customer' | 'owner'

export function getUserRole(user: any): UserRole | null {
  if (!user) return null
  return user.user_metadata?.role || 'customer'
}

export function isOwner(user: any): boolean {
  return getUserRole(user) === 'owner'
}

export function isCustomer(user: any): boolean {
  return getUserRole(user) === 'customer'
}
