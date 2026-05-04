import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else setLoading(false)
      })
      .catch(() => setLoading(false))

    let subscription
    try {
      const { data } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) fetchProfile(session.user.id)
        else { setProfile(null); setLoading(false) }
      })
      subscription = data.subscription
    } catch {
      setLoading(false)
    }
    return () => subscription?.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
      if (error?.code === 'PGRST116') {
        // Profil inexistant — le créer depuis les métadonnées auth
        const { data: { user: authUser } } = await supabase.auth.getUser()
        const meta = authUser?.user_metadata || {}
        const { data: newProfile } = await supabase.from('profiles').insert({
          id:         userId,
          full_name:  meta.full_name  || authUser?.email?.split('@')[0] || '',
          username:   meta.username   || authUser?.email?.split('@')[0] || '',
          phone:      meta.phone      || '',
          location:   meta.location   || '',
          is_premium: false,
        }).select().single()
        setProfile(newProfile)
      } else {
        setProfile(data)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  async function refreshProfile() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) await fetchProfile(session.user.id)
  }

  async function signUp({ email, password, fullName, phone, location, avatarFile }) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName, username: email.split('@')[0], phone: phone || '', location: location || '' } },
    })
    if (error) throw error

    if (data.user) {
      let avatarUrl = null
      if (avatarFile) {
        try {
          const ext = avatarFile.name.split('.').pop()
          const path = `${data.user.id}.${ext}`
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(path, avatarFile, { upsert: true })
          if (!uploadError) {
            const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
            avatarUrl = urlData.publicUrl
          }
        } catch {
          // avatar upload failed silently — profile created without photo
        }
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id:         data.user.id,
        full_name:  fullName,
        username:   email.split('@')[0],
        phone,
        location,
        avatar_url: avatarUrl,
        is_premium: false,
      })
      if (profileError) {
        console.error('Erreur création profil:', profileError.message)
      }
    }

    const needsConfirmation = !data.session
    return { needsConfirmation }
  }

  async function signIn({ email, password }) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    toast.success('Bienvenue sur GameBlox !')
  }

  async function signOut() {
    await supabase.auth.signOut()
    toast.success('À bientôt !')
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
