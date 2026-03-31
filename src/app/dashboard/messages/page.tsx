'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useI18n } from '@/lib/i18n';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useI18n();
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/login');
    if (status === 'authenticated') fetchConversations();
  }, [status]);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat);
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/messages');
      const data = await res.json();
      if (data.success) setConversations(data.data.conversations || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const fetchMessages = async (userId: string) => {
    try {
      const res = await fetch(`/api/messages?with=${userId}`);
      const data = await res.json();
      if (data.success) setMessages(data.data.messages || []);
    } catch (err) { console.error(err); }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeChat) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receiverId: activeChat, content: newMessage }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(m => [...m, data.data]);
        setNewMessage('');
      } else {
        toast.error(data.error || String(t('messages.toasts.sendFailed')));
      }
    } catch (err) { toast.error(String(t('messages.toasts.failed'))); }
    finally { setIsSending(false); }
  };

  const userId = (session?.user as any)?.id;

  return (
    <div className="container-app py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{String(t('messages.title'))}</h1>

      {(session?.user as any)?.subscriptionStatus !== 'ACTIVE' && (session?.user as any)?.role === 'JOB_SEEKER' ? (
        <div className="card p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
          <h3 className="font-semibold text-gray-900 mb-2">{String(t('messages.premiumFeature'))}</h3>
          <p className="text-sm text-gray-500 mb-4">{String(t('messages.premiumDesc'))}</p>
          <button onClick={() => router.push('/pricing')} className="btn btn-accent">{String(t('messages.upgradePremium'))}</button>
        </div>
      ) : (
        <div className="card overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
          <div className="flex h-full">
            {/* Conversations list */}
            <div className={`w-full sm:w-80 border-r border-gray-200 flex flex-col ${activeChat ? 'hidden sm:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-200">
                <input type="text" placeholder={String(t('messages.searchPlaceholder'))} className="input" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                  <div className="p-4 space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full"/>)}</div>
                ) : conversations.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 text-sm">{String(t('messages.noConversations'))}</div>
                ) : (
                  conversations.map((conv: any) => (
                    <button
                      key={conv.partner_id}
                      onClick={() => setActiveChat(conv.partner_id)}
                      className={`w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left ${activeChat === conv.partner_id ? 'bg-primary-50' : ''}`}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary-600">{conv.partner?.profile?.firstName?.[0] || '?'}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 text-sm truncate">{conv.partner?.profile?.firstName} {conv.partner?.profile?.lastName}</p>
                        <p className="text-xs text-gray-400 truncate">{conv.last_message}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat area */}
            <div className={`flex-1 flex flex-col ${!activeChat ? 'hidden sm:flex' : 'flex'}`}>
              {activeChat ? (
                <>
                  <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                    <button onClick={() => setActiveChat(null)} className="sm:hidden btn btn-ghost btn-icon">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-primary-600">?</span>
                    </div>
                    <span className="font-medium text-gray-900 text-sm">{String(t('messages.conversation'))}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((msg: any) => (
                      <div key={msg.id} className={`flex ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${msg.senderId === userId ? 'bg-primary-600 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md'}`}>
                          {msg.content}
                          <p className={`text-xs mt-1 ${msg.senderId === userId ? 'text-primary-200' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-200">
                    <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={String(t('messages.typePlaceholder'))}
                        className="input flex-1"
                      />
                      <button type="submit" disabled={isSending || !newMessage.trim()} className="btn btn-primary">
                        {String(t('messages.send'))}
                      </button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
                  {String(t('messages.selectConversation'))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
