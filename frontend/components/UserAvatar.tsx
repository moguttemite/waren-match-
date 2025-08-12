'use client'

import Avatar from 'react-avatar'

interface UserAvatarProps {
  user?: {
    name?: string
    avatar?: string
  }
  size?: number | string
  className?: string
}

export default function UserAvatar({ user, size = 32, className = '' }: UserAvatarProps) {
  return (
    <Avatar
      name={user?.name || '用户'}
      src={user?.avatar}
      size={size}
      round={true}
      color="#ec4899"
      fgColor="#ffffff"
      className={`flex-shrink-0 ${className}`}
    />
  )
}
