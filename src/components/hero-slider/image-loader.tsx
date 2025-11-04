export function ImageLoader() {
    return (
      <div className="w-full h-[150px] md:h-[200px] rounded-lg bg-white drop-shadow-lg flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
          <p className="text-gray-700 text-sm">Загрузка изображений...</p>
        </div>
      </div>
    )
  }
