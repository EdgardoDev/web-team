import { useEffect, useState } from 'react'
import { webTeamFirestore } from '../firebase/config'

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null)
  const [error, setError] = useState(null)

  // Get real time data for the document
  useEffect(() => {
    const ref = webTeamFirestore.collection(collection).doc(id)

    const unsubscribe = ref.onSnapshot((snapshot) => {
      if (snapshot.data()) {
        setDocument({ ...snapshot.data(), id: snapshot.id })
        setError(null)
      }
      else {
        setError('No such document exists')
      }
    }, (err) => {
      console.log(err.message)
      setError('Failed to get the document.')
    })

    return () => unsubscribe()

  }, [collection, id])

  return { document, error }
}