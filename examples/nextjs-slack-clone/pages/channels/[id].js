import Layout from '~/components/Layout'
import Message from '~/components/Message'
import MessageInput from '~/components/MessageInput'
import Proof from '~/components/Proof'
import ProofUpload from '~/components/ProofUpload'
import { useRouter } from 'next/router'
import { useStore, addMessage, addProof } from '~/lib/Store'
import { useContext, useEffect, useRef } from 'react'
import UserContext from '~/lib/UserContext'

const ChannelsPage = (props) => {
  const router = useRouter()
  const { user, authLoaded, signOut } = useContext(UserContext)
  const messagesEndRef = useRef(null)

  // Else load up the page
  const { id: channelId } = router.query
  const { messages, channels, proofs } = useStore({ channelId })

  useEffect(() => {
    messagesEndRef.current.scrollIntoView({
      block: 'start',
      behavior: 'smooth',
    })
  }, [messages])

  // redirect to public channel when current channel is deleted
  useEffect(() => {
    if (!channels.some((channel) => channel.id === Number(channelId))) {
      router.push('/channels/1')
    }
  }, [channels, channelId])

  // Render the channels and messages
  return (
    <Layout channels={channels} activeChannelId={channelId}>
    <div className="relative h-screen">
    <div className="Messages h-full pb-16">
    <div className="p-2 overflow-y-auto">
    {messages.map((x) => (
      <Message key={x.id} message={x} />
    ))}
    {proofs.map((x) => (
      <Proof key={x.id} proof={x} />
    ))}
            <div ref={messagesEndRef} style={{ height: 0 }} />
          </div>
        </div>
        <div className="p-2 absolute bottom-0 left-0 w-full">
          <MessageInput onSubmit={async (text) => addMessage(text, channelId, user.id)} />
          <ProofUpload size={150} onUpload={async (proofUrl) => addProof(proofUrl, channelId, user.id)} />
        </div>
      </div>
    </Layout>
  )
}

export default ChannelsPage
