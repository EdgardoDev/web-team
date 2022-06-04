import React, { useState } from 'react'
import { useSignup } from '../../hooks/useSignup'
import './Signup.css'

export default function Signup() {

  // Create the state for the fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [thumbnail, setThumbnail] = useState(null)
  const [thumbnailError, setThumbnailError] = useState(null)
  const { signup, isPending, error } = useSignup()

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(email, password, displayName, thumbnail)
  }

  // Function in charge of handling file uploads from user
  const handleFileChange = (e) => {
    // Reset state back to null
    setThumbnail(null)
    // We get the first file selected in the array
    let selected = e.target.files[0]
    console.log(selected)
    // Check if the user has selected a file
    if (!selected) {
      setThumbnailError('Please select a file')
      return
    }
    // Check if the user selected an image file
    if (!selected.type.includes('image')) {
      setThumbnailError('The selected file should be an image')
      return
    }
    // Check the image size
    if (selected.size > 100000) {
      setThumbnailError('The image file size should be less than 100kb')
      return
    }

    setThumbnailError(null)

    // Update the thumbnail state
    setThumbnail(selected)
    console.log('Thumbnail updated')
  }

  return (
    <div>
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign up</h2>
        <label>
          <span>Email:</span>
          <input
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label>
          <span>Password:</span>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label>
          <span>Display Name:</span>
          <input
            type="text"
            onChange={(e) => setDisplayName(e.target.value)}
            value={displayName}
          />
        </label>
        <label>
          <span>Profile Thumbnail:</span>
          <input
            required
            type="file"
            onChange={handleFileChange}
          />
          {thumbnailError && <div className="error">{thumbnailError}</div>}
        </label>
        {!isPending && <button className="btn">Sign up</button>}
        {isPending && <button className="btn" disabled>Loading...</button>}
        {error && <div className="error">{error}</div>}
      </form>
    </div>
  )
}
