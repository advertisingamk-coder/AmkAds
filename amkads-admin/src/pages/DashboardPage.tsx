import React, { useState, useEffect, useMemo } from 'react'
import {
  Plus, Edit2, Trash2, X, UploadCloud, Loader2,
  Search, ArrowUpDown, Star,
} from 'lucide-react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || ''

type PortfolioItem = {
  id: string
  title: string
  brand: string
  type: string
  imageSrc: string
  description: string
  location?: string
  altText?: string
  displayOrder?: number
  isFeatured?: number
  created_at?: string
}

const defaultForm = {
  title: '',
  brand: '',
  type: 'BILLBOARD',
  location: '',
  description: '',
  altText: '',
  displayOrder: 0,
  isFeatured: false,
}

export default function DashboardPage() {
  const [items, setItems]               = useState<PortfolioItem[]>([])
  const [loading, setLoading]           = useState(true)
  const [isModalOpen, setIsModalOpen]   = useState(false)
  const [editingItem, setEditingItem]   = useState<PortfolioItem | null>(null)
  const [isSaving, setIsSaving]         = useState(false)
  const [searchQuery, setSearchQuery]   = useState('')
  const [sortBy, setSortBy]             = useState('newest')
  const [formData, setFormData]         = useState(defaultForm)
  const [imageFile, setImageFile]       = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => { fetchItems() }, [])

  const fetchItems = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/portfolio`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setItems(data as PortfolioItem[])
      }
    } catch {
      toast.error('Failed to load campaigns')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (item?: PortfolioItem) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        title: item.title,
        brand: item.brand,
        type: item.type,
        location: item.location || '',
        description: item.description,
        altText: item.altText || '',
        displayOrder: item.displayOrder || 0,
        isFeatured: item.isFeatured === 1,
      })
      setImagePreview(item.imageSrc)
      setImageFile(null)
    } else {
      setEditingItem(null)
      setFormData(defaultForm)
      setImagePreview(null)
      setImageFile(null)
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new window.Image()
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const MAX = 1200
        let { width, height } = img
        if (width > height) {
          if (width > MAX) { height = Math.round((height * MAX) / width); width = MAX }
        } else {
          if (height > MAX) { width = Math.round((width * MAX) / height); height = MAX }
        }
        canvas.width = width
        canvas.height = height
        canvas.getContext('2d')?.drawImage(img, 0, 0, width, height)
        setImagePreview(canvas.toDataURL('image/jpeg', 0.8))
        setImageFile(file)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const data = new FormData()
    data.append('id', editingItem ? editingItem.id : `item-${Date.now()}`)
    data.append('title', formData.title)
    data.append('brand', formData.brand)
    data.append('type', formData.type)
    data.append('location', formData.location)
    data.append('description', formData.description)
    data.append('altText', formData.altText)
    data.append('displayOrder', formData.displayOrder.toString())
    data.append('isFeatured', formData.isFeatured.toString())
    if (imagePreview) data.append('imageSrc', imagePreview)

    const url = editingItem
      ? `${API_URL}/api/portfolio/${editingItem.id}`
      : `${API_URL}/api/portfolio`

    try {
      const res = await fetch(url, {
        method: editingItem ? 'PUT' : 'POST',
        credentials: 'include',
        body: data,
      })
      if (res.ok) {
        toast.success(editingItem ? 'Campaign updated!' : 'Campaign created!')
        await fetchItems()
        handleCloseModal()
      } else {
        toast.error('Failed to save campaign.')
      }
    } catch {
      toast.error('Error occurred while saving.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this campaign? This cannot be undone.')) return
    const toastId = toast.loading('Deleting…')
    try {
      const res = await fetch(`${API_URL}/api/portfolio/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id))
        toast.success('Campaign deleted', { id: toastId })
      } else {
        toast.error('Failed to delete.', { id: toastId })
      }
    } catch {
      toast.error('Error occurred.', { id: toastId })
    }
  }

  const filteredAndSortedItems = useMemo(() => {
    return items
      .filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime()
        if (sortBy === 'order') return (a.displayOrder || 0) - (b.displayOrder || 0)
        return 0
      })
  }, [items, searchQuery, sortBy])

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white font-outfit mb-1">
            Portfolio Campaigns
          </h1>
          <p className="text-slate-400 text-sm">
            Manage your out-of-home advertising campaigns.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orangeHover text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-brand-orange/20 whitespace-nowrap"
        >
          <Plus size={18} />
          Add Campaign
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by title, brand, or category…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm
                       focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 sm:w-56">
          <ArrowUpDown className="text-slate-500 w-4 h-4 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm
                       focus:outline-none focus:border-brand-orange transition-all"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="order">Custom order</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="animate-spin text-brand-orange" size={36} />
        </div>
      ) : items.length === 0 ? (
        <div className="bg-slate-900 rounded-xl p-16 text-center border border-slate-800 flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <UploadCloud className="w-8 h-8 text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No campaigns yet</h3>
          <p className="text-slate-500 text-sm mb-6 max-w-sm">
            Start building your portfolio by uploading your first OOH advertising campaign.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="bg-brand-orange hover:bg-brand-orangeHover px-6 py-2.5 rounded-xl text-white font-semibold transition-all"
          >
            Upload First Campaign
          </button>
        </div>
      ) : (
        <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-500 text-xs uppercase tracking-wider">
                <th className="p-4 font-medium w-16">Order</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Title &amp; Brand</th>
                <th className="p-4 font-medium hidden sm:table-cell">Category</th>
                <th className="p-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredAndSortedItems.length > 0 ? (
                filteredAndSortedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                    <td className="p-4">
                      <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-medium text-slate-400">
                        {item.displayOrder || 0}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center">
                        <img src={item.imageSrc} alt={item.altText || item.title} className="object-cover w-full h-full" />
                        {item.isFeatured === 1 && (
                          <div className="absolute top-1 right-1 bg-brand-orange rounded-full p-0.5" title="Featured">
                            <Star className="w-2.5 h-2.5 text-white fill-white" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white text-sm mb-0.5 flex items-center gap-2">
                        {item.title}
                        {item.isFeatured === 1 && (
                          <span className="bg-brand-orange/20 text-brand-orange text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            Featured
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{item.brand}</div>
                    </td>
                    <td className="p-4 hidden sm:table-cell">
                      <span className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg border border-slate-700">
                        {item.type}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="p-2 text-slate-400 hover:text-brand-orange hover:bg-brand-orange/10 rounded-lg transition-all"
                          title="Edit"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-500 text-sm">
                    No campaigns match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-slate-800 p-6 flex justify-between items-center z-10">
              <h2 className="text-lg font-semibold text-white font-outfit">
                {editingItem ? 'Edit Campaign' : 'Add New Campaign'}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Campaign Title</label>
                  <input
                    required
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-slate-600"
                    placeholder="e.g. Mega Summer Display"
                  />
                </div>
                {/* Brand */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Brand Name</label>
                  <input
                    required
                    type="text"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-slate-600"
                    placeholder="e.g. Acme Corp"
                  />
                </div>
                {/* Type */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Category / Type</label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-all"
                  >
                    <option value="BILLBOARD">Billboard</option>
                    <option value="LARGE FORMAT BILLBOARD">Large Format</option>
                    <option value="ILLUMINATED BILLBOARD">Illuminated</option>
                    <option value="OVERHEAD GANTRY">Overhead Gantry</option>
                    <option value="HIGHWAY BILLBOARD">Highway</option>
                    <option value="DIGITAL SCREEN">Digital Screen</option>
                    <option value="TRANSIT">Transit</option>
                  </select>
                </div>
                {/* Location */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-slate-600"
                    placeholder="e.g. Main GT Road, Lahore"
                  />
                </div>
                {/* Display Order */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Display Order</label>
                  <input
                    type="number"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange transition-all"
                    placeholder="0"
                  />
                </div>
                {/* Featured toggle */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-300">Feature Status</label>
                  <div className="flex items-center mt-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={formData.isFeatured}
                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      />
                      <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-orangeHover" />
                      <span className="ml-3 text-sm text-slate-300">Highlight in Gallery</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Alt Text */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Alt Text (SEO)</label>
                <input
                  type="text"
                  value={formData.altText}
                  onChange={(e) => setFormData({ ...formData, altText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all placeholder:text-slate-600"
                  placeholder="Brief image description for screen readers…"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20 transition-all min-h-[80px] placeholder:text-slate-600"
                  placeholder="Detailed description of the campaign placement…"
                />
              </div>

              {/* Image upload */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-300">Campaign Image</label>
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-slate-700 border-dashed rounded-xl cursor-pointer bg-slate-950/50 hover:bg-slate-800/50 hover:border-brand-orange/40 transition-all overflow-hidden group">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <UploadCloud className="w-9 h-9 mb-3 text-slate-500 group-hover:text-brand-orange transition-colors" />
                      <p className="text-sm text-slate-400">
                        <span className="font-semibold text-white">Click to upload</span> or drag & drop
                      </p>
                      <p className="text-xs text-slate-500 mt-1">JPG, PNG or WEBP — max 5 MB</p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    required={!editingItem}
                  />
                  {imagePreview && (
                    <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white font-medium text-sm flex items-center gap-2">
                        <UploadCloud size={16} /> Replace Image
                      </span>
                    </div>
                  )}
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-brand-orangeHover text-white font-semibold text-sm transition-all disabled:opacity-50 shadow-lg shadow-brand-orange/20"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : null}
                  {isSaving ? 'Saving…' : editingItem ? 'Save Changes' : 'Upload Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
