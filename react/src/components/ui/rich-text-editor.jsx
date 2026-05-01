import { useEffect, useRef } from "react";

const toolbarButtonClass =
  "rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50";

export function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Write here...",
  minHeightClass = "min-h-28",
  error,
  helperText,
}) {
  const editorRef = useRef(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    if (editor.innerHTML !== (value || "")) {
      editor.innerHTML = value || "";
    }
  }, [value]);

  const runCommand = (command, commandValue) => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    document.execCommand(command, false, commandValue);
    onChange?.(editor.innerHTML);
  };

  const handleInput = () => {
    onChange?.(editorRef.current?.innerHTML || "");
  };

  return (
    <div className="grid gap-2 text-left">
      {label ? <label className="text-sm font-medium text-slate-900">{label}</label> : null}
      <div
        className={`rounded-2xl border bg-slate-50 p-3 shadow-sm transition ${
          error ? "border-rose-500" : "border-slate-200"
        }`}
      >
        <div className="mb-2 flex flex-wrap gap-2">
          <button type="button" className={toolbarButtonClass} onClick={() => runCommand("bold")}>
            Bold
          </button>
          <button type="button" className={toolbarButtonClass} onClick={() => runCommand("italic")}>
            Italic
          </button>
          <button type="button" className={toolbarButtonClass} onClick={() => runCommand("underline")}>
            Underline
          </button>
          <button type="button" className={toolbarButtonClass} onClick={() => runCommand("insertUnorderedList")}>
            Bullet List
          </button>
          <button type="button" className={toolbarButtonClass} onClick={() => runCommand("insertOrderedList")}>
            Number List
          </button>
        </div>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder={placeholder}
          className={`${minHeightClass} w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-fuchsia-500`}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>
      {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
    </div>
  );
}
