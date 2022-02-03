import { useEffect, useState } from 'react'
import { supabase } from 'lib/Store'

export default function ProofUpload({ size, onUpload }) {
  const [proofUrl, setProofUrl] = useState(null)
  const [uploading, setUploading] = useState(false)

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('proof-images').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectUrl(data)
      setProofUrl(url)
    } catch (error) {
      console.log('error downloading image: ', error.message)
    }
  }

  async function uploadProof(event) {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage
        .from('proof-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      onUpload(filePath)
    } catch (error) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <div style={{ width: size }}>
        <label className="button primary block" htmlFor="single">
          {uploading ? 'Uploading ...' : 'Upload'}
        </label>
        <input
          style={{
            visibility: 'hidden',
            position: 'absolute',
          }}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadProof}
          disabled={uploading}
        />
      </div>
    </>
  )
}
