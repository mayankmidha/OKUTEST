'use client'

import { useState } from 'react'
import { 
    Plus, FileText, Trash2, Edit2, 
    Save, X, Check, Globe, Eye, 
    Image as ImageIcon, Loader2, Sparkles
} from 'lucide-react'
import { createPost, updatePost, deletePost } from '@/app/admin/actions'
import { motion, AnimatePresence } from 'framer-motion'

export function BlogManager({ initialPosts }: { initialPosts: any[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isEditing, setIsEditing] = useState<string | null>(null) // 'new' or post.id
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'Mental Health',
    image: '',
    published: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEdit = (post: any) => {
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt || '',
      category: post.category || 'Mental Health',
      image: post.image || '',
      published: post.published
    })
    setIsEditing(post.id)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      if (isEditing === 'new') {
        await createPost(formData)
      } else if (isEditing) {
        await updatePost(isEditing, formData)
      }
      setIsEditing(null)
      // Refresh local state (simplified for MVP, ideally use revalidatePath + router.refresh)
      window.location.reload()
    } catch (e) {
      alert('Error saving post')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return
    try {
      await deletePost(id)
      setPosts(posts.filter(p => p.id !== id))
    } catch (e) {
      alert('Error deleting post')
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-oku-navy text-white flex items-center justify-center">
                <FileText size={18} />
            </div>
            <div>
                <h3 className="text-xl font-display font-bold text-oku-dark">Editorial Desk</h3>
                <p className="text-[10px] uppercase tracking-widest text-oku-taupe font-black opacity-60">Manage platform-wide publications</p>
            </div>
        </div>
        {!isEditing && (
            <button 
                onClick={() => { setFormData({ title: '', content: '', excerpt: '', category: 'Mental Health', image: '', published: false }); setIsEditing('new'); }}
                className="btn-navy flex items-center gap-2"
            >
                <Plus size={16} /> Write New Entry
            </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="card-glass p-10 bg-white shadow-2xl border-none space-y-8"
          >
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-oku-dark">{isEditing === 'new' ? 'Drafting New Publication' : 'Editing Entry'}</h4>
                <button onClick={() => setIsEditing(null)} className="p-2 hover:bg-oku-cream rounded-full transition-all"><X size={20}/></button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Publication Title</label>
                    <input 
                        type="text" 
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Navigating Anxiety in 2026"
                        className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Category</label>
                    <select 
                        value={formData.category}
                        onChange={e => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all appearance-none"
                    >
                        <option value="Mental Health">Mental Health</option>
                        <option value="ADHD">ADHD</option>
                        <option value="Anxiety">Anxiety</option>
                        <option value="Clinical Depth">Clinical Depth</option>
                        <option value="Mindfulness">Mindfulness</option>
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Short Excerpt (SEO)</label>
                <textarea 
                    value={formData.excerpt}
                    onChange={e => setFormData({...formData, excerpt: e.target.value})}
                    rows={2}
                    placeholder="Brief summary for social sharing and search results..."
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-4 text-sm focus:outline-none focus:border-oku-navy transition-all"
                />
            </div>

            <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-black text-oku-taupe">Main Body Content (Markdown supported)</label>
                <textarea 
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    rows={12}
                    placeholder="Pour your clinical wisdom here..."
                    className="w-full bg-oku-cream/30 border border-oku-taupe/10 rounded-2xl p-6 text-sm focus:outline-none focus:border-oku-navy transition-all font-mono leading-relaxed"
                />
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-oku-taupe/5">
                <div className="flex items-center gap-6">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <div className={`w-12 h-6 rounded-full transition-all relative ${formData.published ? 'bg-oku-success' : 'bg-oku-taupe/20'}`}>
                            <input 
                                type="checkbox" 
                                className="hidden"
                                checked={formData.published}
                                onChange={e => setFormData({...formData, published: e.target.checked})}
                            />
                            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.published ? 'left-7 shadow-lg' : 'left-1'}`} />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-oku-taupe group-hover:text-oku-dark">Platform Live</span>
                    </label>
                </div>

                <div className="flex gap-4">
                    <button onClick={() => setIsEditing(null)} className="px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest text-oku-taupe hover:text-red-500">Discard Changes</button>
                    <button 
                        disabled={isSubmitting || !formData.title || !formData.content}
                        onClick={handleSave}
                        className="btn-navy px-12 py-4 flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                        Finalize & Sync
                    </button>
                </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {posts.length === 0 ? (
                <div className="md:col-span-2 py-32 text-center card-glass bg-white border-dashed">
                    <Sparkles className="mx-auto text-oku-purple opacity-20 mb-4" size={48} />
                    <p className="text-oku-taupe font-display italic text-xl">The Oku blog is currently silent.</p>
                    <button onClick={() => setIsEditing('new')} className="mt-6 text-oku-navy font-bold text-sm hover:underline">Write the first entry →</button>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post.id} className="card-glass bg-white p-8 group hover:shadow-2xl transition-all duration-500 flex flex-col border-none">
                        <div className="flex justify-between items-start mb-6">
                            <span className="px-3 py-1 bg-oku-ocean text-oku-navy-light rounded-full text-[8px] font-black uppercase tracking-widest border border-oku-blue-mid/10">
                                {post.category}
                            </span>
                            <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${post.published ? 'bg-green-50 text-green-700 border-green-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                                {post.published ? 'LIVE' : 'DRAFT'}
                            </div>
                        </div>
                        <h4 className="text-2xl font-display font-bold text-oku-dark mb-4 group-hover:text-oku-navy transition-colors">{post.title}</h4>
                        <p className="text-sm text-oku-taupe line-clamp-2 italic mb-8 flex-grow">{post.excerpt || 'No summary provided.'}</p>
                        <div className="mt-auto pt-6 border-t border-oku-taupe/5 flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <button onClick={() => handleEdit(post)} className="text-oku-taupe hover:text-oku-navy transition-all"><Edit2 size={16}/></button>
                                <button onClick={() => handleDelete(post.id)} className="text-oku-taupe hover:text-red-500 transition-all"><Trash2 size={16}/></button>
                            </div>
                            <Link href={`/blog/${post.slug}`} className="text-[9px] font-black uppercase tracking-widest text-oku-navy hover:underline flex items-center gap-1">
                                View Page <Eye size={12}/>
                            </Link>
                        </div>
                    </div>
                ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

import Link from 'next/link'
