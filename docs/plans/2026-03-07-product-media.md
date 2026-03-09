# Product Media (Photos & Video) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Allow admins to upload multiple photos and videos (direct MP4 or YouTube/Vimeo embed) per product, stored on Vercel Blob, displayed on the product page.

**Architecture:** Add `images String[]`, `videoEmbedUrl String?`, `videoFileUrl String?` to the Product model. A new `/api/upload` route handles Vercel Blob uploads. The admin product form gets a multi-image uploader and video inputs. The product detail page renders an image gallery and video player.

**Tech Stack:** Next.js App Router, Vercel Blob (`@vercel/blob`), Prisma/PostgreSQL (Neon), Tailwind CSS

---

## Prerequisites

### Enable Vercel Blob
1. Go to your Vercel project dashboard → Storage → Create → Blob store
2. Link it to your project — Vercel auto-adds `BLOB_READ_WRITE_TOKEN` to env vars
3. Copy `BLOB_READ_WRITE_TOKEN` to your local `.env` file

---

### Task 1: Install Vercel Blob & Update Schema

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `.env` (add `BLOB_READ_WRITE_TOKEN`)

**Step 1: Install the package**
```bash
cd "C:\Users\GK\OneDrive\Documents\GitHub\wood-sun"
npm install @vercel/blob
```

**Step 2: Update `prisma/schema.prisma` — replace the Product model's `image` field**

Change:
```prisma
image       String
```
To:
```prisma
images      String[]  // array of Vercel Blob URLs
videoEmbedUrl String? // YouTube or Vimeo embed URL
videoFileUrl  String? // Direct MP4 Vercel Blob URL
```

**Step 3: Push schema to database**
```bash
npx prisma db push
```
Expected output: `Your database is now in sync with your Prisma schema.`

**Step 4: Verify**
```bash
npx prisma studio
```
Open http://localhost:5555 → Product table → confirm `images`, `videoEmbedUrl`, `videoFileUrl` columns exist.

**Step 5: Commit**
```bash
git add prisma/schema.prisma package.json package-lock.json
git commit -m "feat: add images[] and video fields to Product schema"
```

---

### Task 2: Create Upload API Route

**Files:**
- Create: `app/api/upload/route.ts`

**Step 1: Create the file**

```typescript
// app/api/upload/route.ts
import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'File type not allowed' }, { status: 400 })
  }

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return NextResponse.json({ url: blob.url })
}
```

**Step 2: Test manually via the admin form (tested in Task 3)**

**Step 3: Commit**
```bash
git add app/api/upload/route.ts
git commit -m "feat: add Vercel Blob upload API endpoint"
```

---

### Task 3: Update Admin Product Form

**Files:**
- Modify: `app/admin/page.tsx`

The form needs:
1. Multi-image upload (click to add, click × to remove, shows thumbnails)
2. Video embed URL input (YouTube/Vimeo)
3. Video file upload (MP4)

**Step 1: Add upload helper function** inside `ProductManager` (before the return):

```typescript
async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await fetch('/api/upload', { method: 'POST', body: fd })
  const data = await res.json()
  if (!data.url) throw new Error(data.error || 'Upload failed')
  return data.url
}
```

**Step 2: Add media state to `ProductManager`**

In the `openAdd` function, set:
```typescript
setForm({ ...emptyProduct, images: [], videoEmbedUrl: '', videoFileUrl: '' })
```

In the `openEdit` function, set:
```typescript
setForm({
  ...existingFields,
  images: p.images || [],
  videoEmbedUrl: p.videoEmbedUrl || '',
  videoFileUrl: p.videoFileUrl || '',
})
```

**Step 3: Add image upload UI** in the form modal (after the `image URL` field, replace it entirely):

```tsx
{/* Images */}
<div className="col-span-2">
  <label className="block text-sm font-medium mb-2">Product Images</label>
  <div className="flex flex-wrap gap-3 mb-3">
    {(form.images || []).map((url: string, i: number) => (
      <div key={i} className="relative w-20 h-20">
        <img src={url} alt="" className="w-full h-full object-cover rounded-lg border border-wood-200" />
        <button
          type="button"
          onClick={() => setForm((f: any) => ({ ...f, images: f.images.filter((_: any, idx: number) => idx !== i) }))}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
        >×</button>
      </div>
    ))}
    <label className="w-20 h-20 border-2 border-dashed border-wood-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-wood-500 text-wood-400 text-2xl">
      +
      <input
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={async (e) => {
          const files = Array.from(e.target.files || [])
          const urls = await Promise.all(files.map(uploadFile))
          setForm((f: any) => ({ ...f, images: [...(f.images || []), ...urls] }))
          e.target.value = ''
        }}
      />
    </label>
  </div>
</div>

{/* Video embed URL */}
<div className="col-span-2">
  <label className="block text-sm font-medium mb-1">Video Embed URL (YouTube / Vimeo)</label>
  <input
    className="input w-full"
    placeholder="https://www.youtube.com/embed/..."
    value={form.videoEmbedUrl || ''}
    onChange={e => setForm((f: any) => ({ ...f, videoEmbedUrl: e.target.value }))}
  />
  <p className="text-xs text-gray-400 mt-1">Use the embed URL format, e.g. youtube.com/embed/VIDEO_ID</p>
</div>

{/* Video file upload */}
<div className="col-span-2">
  <label className="block text-sm font-medium mb-1">Video File (MP4)</label>
  {form.videoFileUrl && (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs text-gray-500 truncate max-w-xs">{form.videoFileUrl}</span>
      <button type="button" onClick={() => setForm((f: any) => ({ ...f, videoFileUrl: '' }))} className="text-red-500 text-xs hover:underline">Remove</button>
    </div>
  )}
  <label className="btn btn-outline text-sm px-3 py-1.5 cursor-pointer">
    {form.videoFileUrl ? 'Replace video' : 'Upload MP4'}
    <input
      type="file"
      accept="video/mp4,video/quicktime"
      className="hidden"
      onChange={async (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const url = await uploadFile(file)
        setForm((f: any) => ({ ...f, videoFileUrl: url }))
        e.target.value = ''
      }}
    />
  </label>
</div>
```

**Step 4: Update `handleSave`** — include `images`, `videoEmbedUrl`, `videoFileUrl` in the POST/PUT body (they're already included via the spread `{ ...form, variants }` — no change needed if form state includes them).

**Step 5: Update `emptyProduct` constant** to include the new fields:
```typescript
const emptyProduct = {
  name: '', slug: '', description: '',
  price: '', b2bPrice: '',
  images: [],
  videoEmbedUrl: '',
  videoFileUrl: '',
  material: '', style: '', isPolarized: false,
}
```

**Step 6: Remove the old single `image` input field** from the form grid (the one labeled "Image URL (or emoji)").

**Step 7: Commit**
```bash
git add app/admin/page.tsx
git commit -m "feat: add multi-image and video upload to admin product form"
```

---

### Task 4: Update API Routes to Handle New Fields

**Files:**
- Modify: `app/api/products/route.ts` (POST handler)
- Modify: `app/api/products/[slug]/route.ts` (PUT handler)

**Step 1: Update POST in `app/api/products/route.ts`**

In the `POST` handler, destructure and save the new fields:
```typescript
const { name, slug, description, price, b2bPrice, images, videoEmbedUrl, videoFileUrl, material, style, isPolarized, variants } = body

const product = await prisma.product.create({
  data: {
    name, slug,
    description: description || '',
    price: parseFloat(price),
    b2bPrice: b2bPrice ? parseFloat(b2bPrice) : null,
    images: images || [],
    videoEmbedUrl: videoEmbedUrl || null,
    videoFileUrl: videoFileUrl || null,
    material, style,
    isPolarized: !!isPolarized,
  },
})
```

**Step 2: Update PUT in `app/api/products/[slug]/route.ts`**

```typescript
const { name, description, price, b2bPrice, images, videoEmbedUrl, videoFileUrl, material, style, isPolarized } = body

const product = await prisma.product.update({
  where: { slug },
  data: {
    name, description,
    price: parseFloat(price),
    b2bPrice: b2bPrice ? parseFloat(b2bPrice) : null,
    images: images || [],
    videoEmbedUrl: videoEmbedUrl || null,
    videoFileUrl: videoFileUrl || null,
    material, style,
    isPolarized: !!isPolarized,
  },
  include: { variants: true },
})
```

**Step 3: Update seed data** in the GET handler — replace `image: '😎'` with `images: []` for all three seed products.

**Step 4: Commit**
```bash
git add app/api/products/route.ts app/api/products/[slug]/route.ts
git commit -m "feat: update product API routes to handle images[] and video fields"
```

---

### Task 5: Update Product Detail Page

**Files:**
- Modify: `app/products/[slug]/page.tsx`

Replace the current `<div className="text-6xl mb-6">{product.image}</div>` with a full media section:

**Step 1: Add image gallery** (replace line 62 `<div className="text-6xl...">`):

```tsx
{/* Image gallery */}
{product.images?.length > 0 ? (
  <ImageGallery images={product.images} />
) : (
  <div className="w-full aspect-square bg-wood-50 rounded-2xl flex items-center justify-center text-6xl mb-6 border border-wood-100">
    😎
  </div>
)}

{/* Video */}
{(product.videoEmbedUrl || product.videoFileUrl) && (
  <div className="mb-6">
    {product.videoEmbedUrl ? (
      <iframe
        src={product.videoEmbedUrl}
        className="w-full aspect-video rounded-xl"
        allow="autoplay; fullscreen"
        allowFullScreen
      />
    ) : (
      <video
        src={product.videoFileUrl}
        controls
        className="w-full aspect-video rounded-xl bg-black"
      />
    )}
  </div>
)}
```

**Step 2: Add `ImageGallery` component** at the top of the file (before the default export):

```tsx
function ImageGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)
  return (
    <div className="mb-6">
      <div className="aspect-square rounded-2xl overflow-hidden border border-wood-100 mb-3">
        <img src={images[active]} alt="" className="w-full h-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                i === active ? 'border-wood-600' : 'border-transparent'
              }`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Commit**
```bash
git add app/products/[slug]/page.tsx
git commit -m "feat: add image gallery and video player to product detail page"
```

---

### Task 6: Update Products Listing Page

**Files:**
- Modify: `app/products/page.tsx`

**Step 1: Read the current products page** to see how it renders product images.

**Step 2: Replace any `product.image` reference** with:
```tsx
{product.images?.[0] ? (
  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
) : (
  <span className="text-4xl">😎</span>
)}
```

**Step 3: Commit**
```bash
git add app/products/page.tsx
git commit -m "feat: show first product image on listing page"
```

---

### Task 7: Push & Verify

**Step 1: Push to GitHub**
```bash
git push origin master
```

**Step 2: End-to-end test checklist**
- [ ] Go to `/admin`, click `+ Add Product`
- [ ] Upload 2-3 images — thumbnails appear in the form
- [ ] Paste a YouTube embed URL (e.g. `https://www.youtube.com/embed/dQw4w9WgXcQ`)
- [ ] Save the product
- [ ] Visit `/products/[new-slug]` — image gallery shows, video plays
- [ ] Edit the product — existing images are pre-loaded
- [ ] Remove an image via the × button, save, confirm it's gone

---

## Notes

- `BLOB_READ_WRITE_TOKEN` must be set in `.env` locally and in Vercel project environment variables for production
- The upload API has no auth guard — add session check if admin-only uploads are required
- The old `image` field is replaced by `images[]`; existing seed products will have `images: []` and show the fallback emoji
