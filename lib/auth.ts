/**
 * @deprecated This file contains a mock localStorage-based auth system that
 * predates the NextAuth v5 integration in auth.ts. It is no longer used for
 * authentication. Do NOT import from here for any auth checks — use the
 * `auth()` helper from "@/auth" or the session returned by `useSession()`
 * from "next-auth/react" instead.
 *
 * Safe to delete once all legacy call-sites have been migrated.
 */

export interface User {
  id: string
  email: string
  name: string
  role: 'CLIENT' | 'THERAPIST' | 'ADMIN'
}

export function createMockUser(email: string, password: string): User | null {
  if (!email || !password) return null
  
  const isTherapist = email.includes('therapist') || email.includes('doctor') || email.includes('dr.')
  const isAdmin = email.includes('admin')
  
  let role: 'CLIENT' | 'THERAPIST' | 'ADMIN' = 'CLIENT'
  if (isAdmin) role = 'ADMIN'
  else if (isTherapist) role = 'THERAPIST'
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name: email.split('@')[0],
    role
  }
}

export function loginUser(email: string, password: string): { success: boolean; user?: User; error?: string } {
  try {
    const user = createMockUser(email, password)
    if (!user) {
      return { success: false, error: 'Please enter email and password' }
    }
    
    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('oku_user', JSON.stringify(user))
    }
    
    return { success: true, user }
  } catch (error) {
    return { success: false, error: 'Login failed. Please try again.' }
  }
}

export function getCurrentUser(): User | null {
  try {
    if (typeof window === 'undefined') return null
    
    const userStr = localStorage.getItem('oku_user')
    if (!userStr) return null
    
    return JSON.parse(userStr)
  } catch (error) {
    return null
  }
}

export function logoutUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('oku_user')
  }
}
