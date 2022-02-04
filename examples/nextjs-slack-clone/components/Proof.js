import { useContext, useEffect, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { deleteMessage } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import { supabase } from '~/lib/Store'

const Proof = ({ proof }) => {
  const { user, userRoles } = useContext(UserContext)
  const [ proofUrl, setProofUrl] = useState(null)
  const {proof_url: url} = proof

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path) {
    try {
      const { data, error} = await supabase.storage.from('proof-images').download(path)
      if (error) {
        throw error
      }
      const url = URL.createObjectURL(data)
      setProofUrl(url)
    } catch (error) {
      console.log('Error downloading image: ', error.message)
    }
  }

  return (
    <div className="py-1 flex items-center space-x-2">
      <div>
       {proofUrl ? (
        <a href={proofUrl}>
          <img
            src={proofUrl}
            alt="Proof"
            style={{ height: 400, width: 400 }}
          />
         </a>
        ) : (
          <div />
        )}
      </div>
    </div>
  )
}

export default Proof
