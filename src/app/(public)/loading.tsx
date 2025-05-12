export default function PublicLoading() {
  return (
    <div className="flex justify-center items-center min-h-[60vh] pt-16">
      <div className="relative">
        <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-purple-600 animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-16 w-16 rounded-full border-t-4 border-b-4 border-blue-600 animate-spin"></div>
        </div>
      </div>
    </div>
  );
}
