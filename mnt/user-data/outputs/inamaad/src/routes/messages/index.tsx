// src/routes/messages/index.tsx — Messaging inbox
import React, { useState, useEffect, useRef } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useConversations, useMessages, useSendMessage, useProfile } from '../../hooks'
import { Avatar } from '../../components/ui/index'
import { formatRelativeDate, getInitials } from '../../lib/utils'

export const Route = createFileRoute('/messages/')({ component: MessagesPage })

function MessagesPage() {
  const { data: conversations, isLoading } = useConversations()
  const { data: profile } = useProfile()
  const [activeId, setActiveId] = useState<string | null>(null)
  const activeConv = conversations?.find(c => c.id === activeId)

  useEffect(() => {
    if (conversations?.length && !activeId) setActiveId(conversations[0].id)
  }, [conversations])

  if (isLoading) return <div className="h-[calc(100vh-64px)] flex items-center justify-center text-gray-400 text-sm">Loading messages…</div>

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-gray-100">
          <h1 className="text-base font-semibold text-navy-mid">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {!conversations?.length ? (
            <div className="text-center py-12 px-4">
              <p className="text-3xl mb-3">💬</p>
              <p className="text-sm text-gray-500">No conversations yet</p>
            </div>
          ) : conversations.map(conv => {
            const other = conv.participant_one === profile?.id
              ? (conv as any).p2 : (conv as any).p1
            const isActive = conv.id === activeId
            return (
              <button key={conv.id} onClick={() => setActiveId(conv.id)}
                className={`w-full text-left px-5 py-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${isActive ? 'bg-navy/5 border-l-2 border-l-navy' : ''}`}>
                <div className="flex items-start gap-3">
                  <Avatar name={other?.full_name ?? 'User'} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-sm font-semibold text-navy-mid truncate">{other?.full_name}</p>
                      {conv.last_message_at && <span className="text-[11px] text-gray-400 flex-shrink-0">{formatRelativeDate(conv.last_message_at)}</span>}
                    </div>
                    {conv.listing && <p className="text-[11px] text-gold-muted truncate mb-1">{conv.listing.title}</p>}
                    <p className="text-xs text-gray-400 truncate">{conv.last_message ?? 'No messages yet'}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      {activeId && activeConv
        ? <ChatThread conversationId={activeId} conversation={activeConv} profileId={profile?.id} />
        : (
          <div className="flex-1 flex items-center justify-center text-gray-300">
            <div className="text-center">
              <p className="text-5xl mb-3">💬</p>
              <p className="text-sm">Select a conversation</p>
            </div>
          </div>
        )
      }
    </div>
  )
}

function ChatThread({ conversationId, conversation, profileId }: { conversationId: string; conversation: any; profileId?: string }) {
  const { data: messages } = useMessages(conversationId)
  const sendMsg = useSendMessage()
  const [text, setText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const other = conversation.participant_one === profileId ? conversation.p2 : conversation.p1

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await sendMsg.mutateAsync({ conversationId, receiverId: other?.id, message: text.trim() })
    setText('')
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
        <Avatar name={other?.full_name ?? 'User'} size="sm" />
        <div>
          <p className="text-sm font-semibold text-navy-mid">{other?.full_name}</p>
          {conversation.listing && <p className="text-xs text-gold-muted">{conversation.listing.title}</p>}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {(messages ?? []).map(msg => {
          const isMe = msg.sender_id === profileId
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-xl px-4 py-2.5 text-sm ${isMe ? 'bg-navy text-white rounded-br-sm' : 'bg-white border border-gray-200 text-navy-mid rounded-bl-sm'}`}>
                <p>{msg.message}</p>
                <p className={`text-[11px] mt-1 ${isMe ? 'text-white/50' : 'text-gray-400'}`}>{formatRelativeDate(msg.created_at)}</p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="bg-white border-t border-gray-200 px-4 py-3 flex gap-3">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message…"
          className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-navy" />
        <button type="submit" disabled={!text.trim() || sendMsg.isPending}
          className="bg-navy text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50">
          Send
        </button>
      </form>
    </div>
  )
}
