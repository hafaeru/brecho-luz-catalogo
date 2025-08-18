export default function CardSkeleton() {
  return (
    <div className="border border-stone-200 rounded-lg shadow-sm flex flex-col bg-white overflow-hidden">
      {/* Placeholder da Imagem */}
      <div className="aspect-square w-full bg-stone-200 animate-pulse"></div>
      
      {/* Placeholder do Texto */}
      <div className="p-3">
        <div className="h-4 bg-stone-200 rounded w-3/4 animate-pulse mb-2"></div>
        <div className="h-5 bg-stone-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}