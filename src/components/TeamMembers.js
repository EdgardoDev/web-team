import { useCollection } from '../hooks/useCollection'
import './TeamMembers.css'

import React from 'react'
import Avatar from './Avatar'

export default function TeamMembers() {
  const { error, documents } = useCollection('users')
  return (
    <div className="team-members">
      <h2>Team Members</h2>
      {error && <div className="error">{error}</div>}
      {documents && documents.map(user => (
        <div key={user.id} className="team-members-item">
          {user.online && <span className="team-members-online"></span>}
          <span>{user.displayName}</span>
          <Avatar src={user.photoURL}/>
        </div>
      ))}
    </div>
  )
}
