import { useState, useEffect } from 'react'
import { webTeamAuth, webTeamStorage, webTeamFirestore } from '../firebase/config'
import { useAuthContext } from './useAuthContext'

// This hook will be used any time we need to sign a new user up.


export const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false)
  const [error, setError] = useState(null)
  const [isPending, setIsPending] = useState(false)
  const { dispatch } = useAuthContext()

  const signup = async (email, password, displayName, thumbnail) => {
    setError(null)
    setIsPending(true)
  
    try {
      // signup
      const res = await webTeamAuth.createUserWithEmailAndPassword(email, password)

      if (!res) {
        throw new Error('Could not complete signup')
      }

      // Upload image  of the user (thumbnail)
      const uploadImgPath = `thumbnails/${res.user.uid}/${thumbnail.name}`
      const img = await webTeamStorage.ref(uploadImgPath).put(thumbnail)
      const imgUrl = await img.ref.getDownloadURL()

      // Add display name to user
      await res.user.updateProfile({ displayName, photoURL: imgUrl })

      // Create a new user document
      await webTeamFirestore.collection('users').doc(res.user.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
      })

      // Dispatch login action
      dispatch({ type: 'LOGIN', payload: res.user })

      if (!isCancelled) {
        setIsPending(false)
        setError(null)
      }
    } 
    catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  }

  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  return { signup, error, isPending }
}