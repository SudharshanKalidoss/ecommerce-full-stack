import { Input } from "../../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { RichTextEditor } from "../../ui/rich-text-editor";

export function ProductBasicFields({ form, categories, errors = {}, onChange }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Input
        label="Title *"
        value={form.title}
        maxLength={100}
        description={`${String(form.title || "").length}/100`}
        error={errors.title}
        onChange={(e) => onChange("title", e.target.value)}
      />
      <Input
        label="Slug *"
        value={form.slug}
        maxLength={100}
        description={`${String(form.slug || "").length}/100`}
        error={errors.slug}
        onChange={(e) => onChange("slug", e.target.value)}
      />
      <Input
        label="Sale Price *"
        type="number"
        value={form.salePrice}
        error={errors.salePrice}
        onChange={(e) => onChange("salePrice", e.target.value)}
      />
      <Input
        label="Compare Price *"
        type="number"
        value={form.comparePrice}
        error={errors.comparePrice}
        onChange={(e) => onChange("comparePrice", e.target.value)}
      />
      <Input
        label="Stock *"
        type="number"
        value={form.stock}
        error={errors.stock}
        onChange={(e) => onChange("stock", e.target.value)}
      />

      <div className="grid gap-2 text-left">
        <label className="text-sm font-medium text-slate-900">Category *</label>
        <Select value={form.categoryId} onValueChange={(value) => onChange("categoryId", value)}>
          <SelectTrigger className={errors.categoryId ? "border-rose-500 hover:border-rose-500 focus:ring-rose-100 data-[state=open]:border-rose-500" : ""}>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.categoryId && <p className="text-sm text-rose-600">{errors.categoryId}</p>}
      </div>

      <div className="grid gap-2 text-left sm:col-span-2">
        <RichTextEditor
          label="Short Description *"
          value={form.shortDescription}
          onChange={(html) => onChange("shortDescription", html)}
          placeholder="Write short description..."
          minHeightClass="min-h-24"
          error={errors.shortDescription}
          helperText={`${String(form.shortDescription || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim().length}/5000`}
        />
      </div>

      <div className="grid gap-2 text-left sm:col-span-2">
        <RichTextEditor
          label="Description *"
          value={form.description}
          onChange={(html) => onChange("description", html)}
          placeholder="Write full description..."
          minHeightClass="min-h-28"
          error={errors.description}
        />
      </div>
    </div>
  );
}
