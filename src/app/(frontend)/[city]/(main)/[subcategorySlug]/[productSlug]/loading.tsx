export default function Loading() {
    return (
      <div className="min-h-screen mx-auto bg-white max-w-7xl animate-pulse">
        <div className="px-3 pt-4 sm:px-6">
          <div className="h-10 w-40 bg-gray-200 rounded-lg" />
        </div>
  
        <div className="px-3 py-4 sm:px-6">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-3/4 bg-gray-200 rounded-lg" />
            <div className="h-1 w-32 bg-gray-200 rounded-full" />
          </div>
        </div>
  
        <div className="px-3 py-4 sm:px-6 sm:py-10">
          <div className="bg-gray-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-6">
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
              <div className="h-4 bg-gray-200 rounded w-4/6" />
            </div>
          </div>
  
          <div className="flex justify-center">
            <div className="h-14 w-48 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }
  