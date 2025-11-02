export default function BookSkeleton() {
  return (
    <div className="animate-pulse border rounded-xl p-3">
      <div className="bg-gray-300 dark:bg-gray-700 h-56 w-full mb-3 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-700 mb-2 rounded"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-700 w-2/3 rounded"></div>
    </div>
  );
}
