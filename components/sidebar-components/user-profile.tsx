type UserProfileProps = {
  userEmail: string
  userName: string
}

export default function UserProfile( { userName, userEmail }: UserProfileProps) {
  return (
    <div className="p-4 border-t">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-linear-to-br from-gray-800 to-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">AD</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
          <p className="text-xs text-gray-500 truncate">{userEmail}</p>
        </div>
      </div>
    </div>
  )
}