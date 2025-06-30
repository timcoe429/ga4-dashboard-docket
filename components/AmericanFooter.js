export default function AmericanFooter() {
  return (
    <div className="text-center mt-8 py-4">
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <span>Proudly Built in</span>
        <div className="inline-flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            <div className="w-1 h-3 bg-red-500 rounded-sm"></div>
            <div className="w-1 h-3 bg-white border border-gray-300 rounded-sm"></div>
            <div className="w-1 h-3 bg-blue-600 rounded-sm"></div>
          </div>
          <span className="font-medium text-gray-700">America</span>
        </div>
      </div>
    </div>
  );
} 