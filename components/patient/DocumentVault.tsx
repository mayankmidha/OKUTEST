'use client'

import { useState, useEffect } from 'react'
import { Upload, FileText, Download, Shield, AlertCircle } from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'

interface Document {
  id: string
  name: string
  type: string
  url: string
  uploadedBy: 'CLIENT' | 'PRACTITIONER'
  isPrivate: boolean
  createdAt: Date
  size?: number
  category?: string
}

interface DocumentVaultProps {
  clientId: string
  isPractitioner?: boolean
  practitionerId?: string
}

export function DocumentVault({ clientId, isPractitioner = false, practitionerId }: DocumentVaultProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [clientId])

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`/api/documents?clientId=${clientId}`)
      const docs = await response.json()
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to fetch documents:', error)
    }
    setLoading(false)
  }

  const handleFileUpload = async (files: FileList) => {
    setUploading(true)
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      
      // Validate file type and size
      if (!validateFile(file)) {
        alert(`Invalid file: ${file.name}. Please upload PDF, DOC, DOCX, or image files under 10MB.`)
        continue
      }

      const formData = new FormData()
      formData.append('file', file)
      formData.append('name', file.name)
      formData.append('type', getFileType(file.name))
      formData.append('clientId', clientId)
      formData.append('isPrivate', 'false')
      formData.append('uploadedBy', isPractitioner ? 'PRACTITIONER' : 'CLIENT')

      try {
        const response = await fetch('/api/documents/upload', {
          method: 'POST',
          body: formData
        })

        if (response.ok) {
          const newDoc = await response.json()
          setDocuments(prev => [...prev, newDoc])
        } else {
          alert(`Failed to upload ${file.name}`)
        }
      } catch (error) {
        console.error('Upload failed:', error)
        alert(`Failed to upload ${file.name}`)
      }
    }
    
    setUploading(false)
    setDragActive(false)
  }

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png']
    const maxSize = 10 * 1024 * 1024 // 10MB
    
    return allowedTypes.includes(file.type) && file.size <= maxSize
  }

  const getFileType = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    const typeMap: Record<string, string> = {
      'pdf': 'CLINICAL_REPORT',
      'doc': 'INTAKE_FORM',
      'docx': 'TREATMENT_PLAN',
      'jpg': 'IDENTIFICATION',
      'jpeg': 'IDENTIFICATION',
      'png': 'IDENTIFICATION'
    }
    return typeMap[ext] || 'OTHER'
  }

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setDocuments(prev => prev.filter(doc => doc.id !== docId))
      } else {
        alert('Failed to delete document')
      }
    } catch (error) {
      console.error('Delete failed:', error)
      alert('Failed to delete document')
    }
  }

  const handleDownload = async (doc: Document) => {
    try {
      const link = document.createElement('a')
      link.href = doc.url
      link.download = doc.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Download failed:', error)
      alert('Failed to download document')
    }
  }

  const categorizeDocuments = (docs: Document[]) => {
    return {
      clinical: docs.filter(doc => doc.type === 'CLINICAL_REPORT'),
      intake: docs.filter(doc => doc.type === 'INTAKE_FORM'),
      treatment: docs.filter(doc => doc.type === 'TREATMENT_PLAN'),
      identification: docs.filter(doc => doc.type === 'IDENTIFICATION'),
      other: docs.filter(doc => doc.type === 'OTHER')
    }
  }

  const categorized = categorizeDocuments(documents)

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl shadow-premium border border-oku-taupe/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-oku-purple/20 rounded-2xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-oku-purple" />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-oku-dark">Document Vault</h2>
              <p className="text-oku-taupe">Secure clinical document management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-oku-taupe">
              {documents.length} documents
            </div>
            <button className="px-4 py-2 bg-oku-purple text-white rounded-xl text-sm font-medium hover:bg-oku-purple-dark transition-colors">
              Manage Access
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            dragActive 
              ? 'border-oku-purple bg-oku-purple/5' 
              : 'border-oku-taupe/30 hover:border-oku-taupe/50'
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragActive(true)
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault()
            handleFileUpload(e.dataTransfer.files)
          }}
        >
          <Upload className="w-8 h-8 text-oku-taupe/40 mx-auto mb-4" />
          <p className="text-oku-dark font-medium mb-2">
            {uploading ? 'Uploading documents...' : 'Drag & drop documents here'}
          </p>
          <p className="text-sm text-oku-taupe mb-4">
            or click to browse
          </p>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            className="hidden"
            id="file-upload"
          />
          <label 
            htmlFor="file-upload"
            className="px-6 py-3 bg-oku-navy text-white rounded-xl text-sm font-medium hover:bg-oku-dark transition-colors cursor-pointer"
          >
            Choose Files
          </label>
          
          <div className="mt-4 text-xs text-oku-taupe">
            <Shield className="w-4 h-4 inline mr-1" />
            Secure upload • Max 10MB per file • PDF, DOC, DOCX, JPG, PNG
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-oku-purple"></div>
          <p className="ml-3 text-oku-taupe">Loading documents...</p>
        </div>
      )}

      {/* Documents by Category */}
      {!loading && (
        <div className="space-y-6">
          {/* Clinical Reports */}
          {(categorized.clinical.length > 0) && (
            <DashboardCard variant="lavender" className="p-6">
              <h3 className="text-lg font-bold text-oku-dark mb-4">Clinical Reports</h3>
              <div className="space-y-3">
                {categorized.clinical.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-oku-lavender-dark" />
                      <div>
                        <p className="font-medium text-oku-dark">{doc.name}</p>
                        <p className="text-sm text-oku-taupe">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-oku-taupe hover:text-oku-purple transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-oku-taupe hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Intake Forms */}
          {(categorized.intake.length > 0) && (
            <DashboardCard variant="glacier" className="p-6">
              <h3 className="text-lg font-bold text-oku-dark mb-4">Intake Forms</h3>
              <div className="space-y-3">
                {categorized.intake.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-oku-glacier-dark" />
                      <div>
                        <p className="font-medium text-oku-dark">{doc.name}</p>
                        <p className="text-sm text-oku-taupe">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-oku-taupe hover:text-oku-purple transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-oku-taupe hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Treatment Plans */}
          {(categorized.treatment.length > 0) && (
            <DashboardCard variant="matcha" className="p-6">
              <h3 className="text-lg font-bold text-oku-dark mb-4">Treatment Plans</h3>
              <div className="space-y-3">
                {categorized.treatment.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-oku-matcha-dark" />
                      <div>
                        <p className="font-medium text-oku-dark">{doc.name}</p>
                        <p className="text-sm text-oku-taupe">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-oku-taupe hover:text-oku-purple transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-oku-taupe hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Identification Documents */}
          {(categorized.identification.length > 0) && (
            <DashboardCard variant="rose" className="p-6">
              <h3 className="text-lg font-bold text-oku-dark mb-4">Identification Documents</h3>
              <div className="space-y-3">
                {categorized.identification.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-oku-rose-dark" />
                      <div>
                        <p className="font-medium text-oku-dark">{doc.name}</p>
                        <p className="text-sm text-oku-taupe">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-oku-taupe hover:text-oku-purple transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-oku-taupe hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Other Documents */}
          {(categorized.other.length > 0) && (
            <DashboardCard variant="white" className="p-6">
              <h3 className="text-lg font-bold text-oku-dark mb-4">Other Documents</h3>
              <div className="space-y-3">
                {categorized.other.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-oku-taupe/5 rounded-xl">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-oku-taupe" />
                      <div>
                        <p className="font-medium text-oku-dark">{doc.name}</p>
                        <p className="text-sm text-oku-taupe">
                          {new Date(doc.createdAt).toLocaleDateString()} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-2 text-oku-taupe hover:text-oku-purple transition-colors"
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="p-2 text-oku-taupe hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <AlertCircle className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          )}

          {/* Empty State */}
          {documents.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-oku-taupe/40 mx-auto mb-4" />
              <p className="text-oku-taupe">No documents uploaded yet</p>
              <p className="text-sm text-oku-taupe">Upload your first clinical document to get started</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
