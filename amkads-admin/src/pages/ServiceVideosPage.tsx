import { useState, useEffect } from 'react'
import {
  Layers, Bus, Monitor, Plane, ShoppingBag,
  UploadCloud, Trash2, Video, Loader2,
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'https://amkads.advertisingamk.workers.dev'

type ServiceCard = {
  title: string
  slug: string
  icon: React.ElementType
}

const SERVICES: ServiceCard[] = [
  { title: 'Billboard Advertising',     slug: 'billboard-advertising',     icon: Layers },
  { title: 'Transit & Transport Media', slug: 'transit-transport-media',   icon: Bus },
  { title: 'Digital OOH (DOOH)',         slug: 'digital-ooh',              icon: Monitor },
  { title: 'Airport Media',              slug: 'airport-media',            icon: Plane },
  { title: 'Mall & Retail Media',        slug: 'mall-retail-media',        icon: ShoppingBag },
]

export default function ServiceVideosPage() {
  const [videoMap, setVideoMap]         = useState<Record<string, string>>({})
  const [loading, setLoading]           = useState(true)
  const [uploadingSlug, setUploadingSlug] = useState<string | null>(null)

  useEffect(() => { fetchVideoMappings() }, [])

  const fetchVideoMappings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/service-videos`, { credentials: 'include' })
      if (res.ok) setVideoMap(await res.json() as Record<string, string>)
    } catch {
      toast.error('Failed to load video data')
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async (slug: string, file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please select a valid video file.')
      return
    }
    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video size must be less than 100 MB.')
      return
    }

    setUploadingSlug(slug)
    const toastId = toast.loading('Uploading video…')

    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch(`${API_URL}/api/admin/service-videos/${slug}`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })
      if (res.ok) {
        toast.success('Video uploaded!', { id: toastId })
        fetchVideoMappings()
      } else {
        const data = await res.json() as { error?: string }
        toast.error(data.error || 'Upload failed', { id: toastId })
      }
    } catch {
      toast.error('Error during upload', { id: toastId })
    } finally {
      setUploadingSlug(null)
    }
  }

  const handleDelete = async (slug: string) => {
    if (!confirm('Remove this video?')) return
    const toastId = toast.loading('Removing video…')
    try {
      const res = await fetch(`${API_URL}/api/admin/service-videos/${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        toast.success('Video removed', { id: toastId })
        fetchVideoMappings()
      } else {
        toast.error('Failed to remove', { id: toastId })
      }
    } catch {
      toast.error('Error occurred', { id: toastId })
    }
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit mb-1">
          Service Videos
        </h1>
        <p className="text-slate-400 text-sm">
          Manage modal videos for your Full-Spectrum OOH Services.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={36} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => {
            const Icon      = service.icon
            const videoUrl  = videoMap[service.slug]
            const isUploading = uploadingSlug === service.slug

            return (
              <div
                key={service.slug}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col shadow-lg hover:border-slate-700 transition-all"
              >
                {/* Service info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0 border border-brand-orange/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-outfit font-bold text-white leading-tight">{service.title}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{service.slug}</p>
                  </div>
                </div>

                {/* Video preview */}
                <div className="flex-grow flex flex-col items-center justify-center bg-slate-950 rounded-xl border border-dashed border-slate-700 mb-5 min-h-[160px] relative overflow-hidden group">
                  {videoUrl ? (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
                      <video
                        src={videoUrl}
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                        muted
                        autoPlay
                        loop
                        playsInline
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="bg-black/50 text-white p-3 rounded-full backdrop-blur-sm">
                          <Video className="w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Video className="w-7 h-7 text-slate-700 mx-auto mb-2" />
                      <p className="text-slate-600 text-xs font-medium">No video uploaded</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-auto">
                  <label className="flex-1 cursor-pointer">
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0]
                        if (f) handleFileUpload(service.slug, f)
                        // Reset input value so same file can be re-selected
                        e.target.value = ''
                      }}
                      disabled={isUploading}
                    />
                    <div
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        videoUrl
                          ? 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                          : 'bg-brand-orange hover:bg-brand-orangeHover text-white shadow-lg shadow-brand-orange/20'
                      } ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      {isUploading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <UploadCloud className="w-4 h-4" />
                      }
                      {isUploading ? 'Uploading…' : videoUrl ? 'Replace Video' : 'Upload Video'}
                    </div>
                  </label>

                  {videoUrl && (
                    <button
                      onClick={() => handleDelete(service.slug)}
                      disabled={isUploading}
                      className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-all disabled:opacity-50"
                      title="Remove Video"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
