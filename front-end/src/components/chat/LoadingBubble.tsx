export const LoadingBubble = () => (
  <div className="flex justify-start py-2">
    <div className="mr-2 flex-shrink-0">
      <div className="overflow-hidden rounded-full border-[0.06rem] border-gray-600" style={{ width: 40, height: 40 }}>
        <img src="/images/cuteRobotWithHeart.png" alt="AI profile" className="object-cover" width={40} height={40} />
      </div>
    </div>
    <div className="max-w-[80%] rounded-xl rounded-tl-none border border-gray-200 bg-white p-3">
      <div className="flex space-x-1">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></div>
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '600ms' }}></div>
      </div>
    </div>
  </div>
);
