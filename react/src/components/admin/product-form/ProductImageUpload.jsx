export function ProductImageUpload({ thumbnailPreview, onFileChange }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-900">Thumbnail *</p>
      <div className="mt-3 flex items-center gap-4">
        <div className="h-20 w-20 overflow-hidden rounded-xl border border-slate-200 bg-white">
          {thumbnailPreview ? (
            <img src={thumbnailPreview} alt="Thumbnail preview" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">No image</div>
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => onFileChange(e.target.files?.[0] || null)}
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-fuchsia-600 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-fuchsia-500"
        />
      </div>
    </div>
  );
}
