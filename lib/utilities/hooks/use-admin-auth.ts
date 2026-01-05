// hooks/useAdminAuth.ts
"use client"

import { supabase } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAdminAuth(redirectTo = '/dashboard') {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAdmin() {
      setIsLoading(true)
      
      try {
        // Verificar autenticação
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error || !user) {
          router.replace('/signin')
          return
        }

        setUser(user)

        // Verificar role
        const { data: usuario } = await supabase
          .from('usuario')
          .select('*, role:role_id(name)')
          .eq('auth_user_id', user.id)
          .single()

        const isUserAdmin = usuario?.role?.name === 'admin'
        setIsAdmin(isUserAdmin)

        if (!isUserAdmin) {
          router.replace(redirectTo)
        }

      } catch (error) {
        console.error('Erro na verificação de admin:', error)
        router.replace('/signin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [router, redirectTo])

  return { isLoading, isAdmin, user }
}