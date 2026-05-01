import { useMemo, useState } from "react";
import { Button } from "../../ui/button";
import { ProductBasicFields } from "./ProductBasicFields";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductVariantsField } from "./ProductVariantsField";

const slugify = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

const stripHtml = (value) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .trim();

const TEXT_LIMITS = {
  title: 100,
  slug: 100,
};
const SHORT_DESCRIPTION_LIMIT = 5000;

const toFormState = (product) => ({
  title: product?.title || "",
  salePrice: product?.salePrice || "",
  comparePrice: product?.comparePrice || "",
  status: product?.status ?? true,
  shortDescription: product?.shortDescription || "",
  description: product?.description || "",
  categoryId: product?.categoryId ? String(product.categoryId) : "",
  slug: product?.slug || "",
  stock: product?.stock ?? "",
  thumbnailUrl: product?.thumbnail || product?.thumbnailUrl || "",
  thumbnailFile: null,
  variants: (product?.variants || []).map((variant) => ({
    id: variant.id,
    size: variant.size,
    salePrice: variant.salePrice || "",
    comparePrice: variant.comparePrice || "",
    stock: variant.stock ?? "",
  })),
});

export function ProductForm({
  initialProduct,
  categories,
  mode = "create",
  loading,
  submitLabel,
  onSubmit,
}) {
  const [form, setForm] = useState(() => toFormState(initialProduct));
  const [errors, setErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(mode !== "create");

  const thumbnailPreview = useMemo(() => {
    if (form.thumbnailFile) return URL.createObjectURL(form.thumbnailFile);
    return form.thumbnailUrl || "";
  }, [form.thumbnailFile, form.thumbnailUrl]);

  const setField = (field, value) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));

    const normalizedValue =
      typeof value === "string" && TEXT_LIMITS[field]
        ? value.slice(0, TEXT_LIMITS[field])
        : value;

    if (field === "slug") {
      setSlugTouched(true);
      setForm((prev) => ({ ...prev, slug: normalizedValue }));
      return;
    }

    if (field === "title") {
      setForm((prev) => {
        const next = { ...prev, title: normalizedValue };
        if (mode === "create" && !slugTouched) {
          next.slug = slugify(normalizedValue).slice(0, TEXT_LIMITS.slug);
        }
        return next;
      });
      return;
    }

    setForm((prev) => ({ ...prev, [field]: normalizedValue }));
  };

  const validate = () => {
    const nextErrors = {};
    const requireNumber = (raw, field, label) => {
      if (raw === "" || raw === null || raw === undefined) {
        nextErrors[field] = `${label} is required`;
        return null;
      }
      const n = Number(raw);
      if (!Number.isFinite(n)) {
        nextErrors[field] = `${label} must be a number`;
        return null;
      }
      if (n < 0) {
        nextErrors[field] = `${label} cannot be negative`;
        return null;
      }
      return n;
    };

    if (!form.title.trim()) nextErrors.title = "Title is required";
    if (!form.slug.trim()) nextErrors.slug = "Slug is required";
    if (form.title.length > TEXT_LIMITS.title) nextErrors.title = `Title must be at most ${TEXT_LIMITS.title} characters`;
    if (form.slug.length > TEXT_LIMITS.slug) nextErrors.slug = `Slug must be at most ${TEXT_LIMITS.slug} characters`;
    if (!form.categoryId) nextErrors.categoryId = "Category is required";
    if (!stripHtml(form.shortDescription)) nextErrors.shortDescription = "Short description is required";
    if (stripHtml(form.shortDescription).length > SHORT_DESCRIPTION_LIMIT) {
      nextErrors.shortDescription = `Short description must be at most ${SHORT_DESCRIPTION_LIMIT} characters`;
    }
    if (!stripHtml(form.description)) nextErrors.description = "Description is required";

    const salePrice = requireNumber(form.salePrice, "salePrice", "Sale price");
    const comparePrice = requireNumber(form.comparePrice, "comparePrice", "Compare price");
    requireNumber(form.stock, "stock", "Stock");

    if (salePrice !== null && comparePrice !== null && comparePrice <= salePrice) {
      nextErrors.comparePrice = "Compare price must be greater than sale price";
    }

    if (!form.thumbnailFile && !form.thumbnailUrl) {
      // For updates, don't require thumbnail if product already exists
      if (mode === "create") {
        nextErrors.thumbnail = "Thumbnail image is required";
      }
    }

    // Variants are optional; if provided, validate inner fields strictly
    if (Array.isArray(form.variants) && form.variants.length > 0) {
      for (const v of form.variants) {
        if (v.salePrice === "" || v.comparePrice === "" || v.stock === "") {
          nextErrors.variants = "All selected variants must have sale price, compare price and stock";
          break;
        }
        const vSale = Number(v.salePrice);
        const vCompare = Number(v.comparePrice);
        const vStock = Number(v.stock);
        if (!Number.isFinite(vSale) || vSale < 0) nextErrors.variants = "Variant sale price must be a valid non-negative number";
        if (!Number.isFinite(vCompare) || vCompare < 0) nextErrors.variants = "Variant compare price must be a valid non-negative number";
        if (!Number.isFinite(vStock) || vStock < 0) nextErrors.variants = "Variant stock must be a valid non-negative number";
        if (Number.isFinite(vSale) && Number.isFinite(vCompare) && vCompare <= vSale) nextErrors.variants = "Variant compare price must be greater than sale price";
        if (nextErrors.variants) break;
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit({
      ...form,
      categoryId: Number(form.categoryId),
      stock: Number(form.stock || 0),

      

      
      variants: form.variants.map((variant) => ({
        id: variant.id,
        size: variant.size,
        salePrice: String(variant.salePrice),
        comparePrice: String(variant.comparePrice),
        stock: Number(variant.stock || 0),
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <ProductBasicFields form={form} categories={categories} errors={errors} onChange={setField} />
      <ProductImageUpload
        thumbnailPreview={thumbnailPreview}
        onFileChange={(file) => setField("thumbnailFile", file)}
      />
      {errors.thumbnail && <p className="text-sm text-rose-600">{errors.thumbnail}</p>}
      <ProductVariantsField variants={form.variants} onVariantsChange={(variants) => setField("variants", variants)} />
      {errors.variants && <p className="text-sm text-rose-600">{errors.variants}</p>}
      <Button type="submit" disabled={loading} className="sm:w-auto sm:px-6">
        {loading ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
