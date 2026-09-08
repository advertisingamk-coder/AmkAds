import React, { useState, useEffect } from 'react'
import { Plus, Trash2, X, UploadCloud, Loader2, Play, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://amkads.advertisingamk.workers.dev'

type MediaItem = {
  id: number
  division_slug: string
  media_type: 'image' | 'video'
  media_url: string
  title: string
}

const DIVISIONS = [
  { slug: 'digital-marketing', label: 'Digital Marketing' },
  { slug: 'creative-agency',   label: 'Creative Agency' },
  { slug: 'event-management',  label: 'Event Management' },
  { slug: 'corporate-services',label: 'Corporate Services' },
]

export default function DivisionMediaPage() {
  const [activeDivision, setActiveDivision] = useState(DIVISIONS[0].slug)
  const [items, setItems]                   = useState<MediaItem[]>([])
  const [loading, setLoading]               = useState(true)
  const [isModalOpen, setIsModalOpen]       = useState(false)
  const [isUploading, setIsUploading]       = useState(false)
  const [file, setFile]                     = useState<File | null>(null)
  const [title, setTitle]                   = useState('')

  useEffect(() => { fetchMedia() }, [activeDivision])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/division-media/${activeDivision}`, { credentials: 'include' })
      if (res.ok) setItems(await res.json() as MediaItem[])
    } catch {
      toast.error('Failed to load media')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this file? This cannot be undone.')) return
    const toastId = toast.loading('Deleting…')
    try {
      const res = await fetch(`${API_URL}/api/admin/division-media/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        toast.success('Deleted successfully', { id: toastId })
      } else {
        toast.error('Failed to delete', { id: toastId })
      }
    } catch {
      toast.error('Error occurred', { id: toastId })
    }
  }

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)
    const data = new FormData()
    data.append('file', file)
    data.append('title', title)

    try {
      const res = await fetch(`${API_URL}/api/admin/division-media/${activeDivision}`, {
        method: 'POST',
        credentials: 'include',
        body: data,
      })
      if (res.ok) {
        toast.success('Uploaded successfully!')
        await fetchMedia()
        setIsModalOpen(false)
        setFile(null)
        setTitle('')
      } else {
        const err = await res.json() as { error?: string }
        toast.error(err.error || 'Failed to upload')
      }
    } catch {
      toast.error('Error occurred while uploading.')
    } finally {
      setIsUploading(false)
    }
  }

  const activeDivisionLabel = DIVISIONS.find((d) => d.slug === activeDivision)?.label ?? ''

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit mb-1">
            Division Galleries
          </h1>
          <p className="text-slate-400 text-sm">
            Manage images and videos for the 4 Group divisions.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/20 whitespace-nowrap"
        >
          <Plus size={18} />
          Upload Media
        </button>
      </div>

      {/* Division Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 bg-slate-900 rounded-xl mb-8 border border-slate-800">
        {DIVISIONS.map((div) => (
          <button
            key={div.slug}
            onClick={() => setActiveDivision(div.slug)}
            className={`px-4 py-2.5 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
              activeDivision === div.slug
                ? 'bg-brand-orange text-white shadow-lg shadow-brand-orange/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {div.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={36} />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-16 text-center border border-slate-800 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No media uploaded</h3>
          <p className="text-slate-500 text-sm">This division gallery is empty.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <div
              key={item.id}
              className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-brand-orange/40 transition-all"
            >
              <div className="aspect-video relative bg-slate-950 flex justify-center items-center">
                {item.media_type === 'image' ? (
                  <img
                    src={item.media_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <video src={item.media_url} className="w-full h-full object-cover opacity-50" />
                    <Play className="absolute text-white w-7 h-7 opacity-80 drop-shadow-lg" />
                  </>
                )}
                <div className="absolute top-2 right-2">
                  <span className="bg-black/60 text-white text-[9px] px-2 py-1 rounded backdrop-blur uppercase font-bold tracking-wider flex items-center gap-1">
                    {item.media_type === 'image'
                      ? <ImageIcon size={10} />
                      : <Play size={10} />
                    }
                    {item.media_type}
                  </span>
                </div>
              </div>
              <div className="p-3 flex justify-between items-start gap-3">
                <p className="text-xs font-medium text-slate-300 truncate">{item.title || 'Untitled'}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="shrink-0 text-slate-600 hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-slate-800 p-6 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-white font-outfit">
                Upload to {activeDivisionLabel}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Title / Caption (Optional)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-slate-600"
                  placeholder="e.g. 2024 Campaign Launch"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">File</label>
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm
                             file:mr-4 file:py-1.5 file:px-4 file:rounded-lg file:border-0
                             file:text-sm file:font-semibold file:bg-brand-orange/20 file:text-brand-orange
                             hover:file:bg-brand-orange/30 cursor-pointer"
                />
                <p className="text-xs text-slate-500">Images (JPG/PNG/WEBP) or Videos (MP4/WEBM)</p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 font-medium text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading || !file}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-brand-orange/20"
                >
                  {isUploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
                  {isUploading ? 'Uploading…' : 'Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
