import { useContext, useEffect, useState } from 'react'
import UserContext from '~/lib/UserContext'
import { deleteMessage, editProof } from '~/lib/Store'
import TrashIcon from '~/components/TrashIcon'
import { supabase } from '~/lib/Store'

const Proof = ({ proof }) => {
  const { user, userRoles } = useContext(UserContext)
  const [ proofUrl, setProofUrl] = useState(null)
  const { proof_url: url, status: proof_status } = proof

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

  async function approveProof() {
    editProof(proof, {status: 'approved'})
  }
  async function denyProof() {
    editProof(proof, {status: 'denied'})
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
    <div>
    <p>Status: {proof.status}</p>
    <button
      className="bg-green-900 hover:bg-green-800 text-white py-2 px-4 my-1 rounded w-full transition duration-150"
    onClick={() => approveProof()}>Approve</button>
    <button 
      className="bg-red-900 hover:bg-red-800 text-white py-2 px-4 my-1 rounded w-full transition duration-150"
    onClick={() => denyProof()}>Deny</button>
    </div>
    </div>
  )
}

export default Proof
