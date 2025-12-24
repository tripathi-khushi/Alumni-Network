import { useState, useEffect, useRef } from "react";
import { X, Send, MessageCircle, Loader2 } from "lucide-react";
import api from "../lib/api";
import { useAuth } from "../contexts/AuthContext";

interface Message {
  _id: string;
  senderId: {
    _id: string;
    name: string;
    email: string;
  };
  receiverId: {
    _id: string;
    name: string;
    email: string;
  };
  content: string;
  read: boolean;
  createdAt: string;
}

interface MentorshipChatProps {
  isOpen: boolean;
  onClose: () => void;
  mentorshipId: string;
  otherPerson: {
    _id: string;
    name: string;
    email: string;
  };
}

const MentorshipChat = ({ isOpen, onClose, mentorshipId, otherPerson }: MentorshipChatProps) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, mentorshipId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/messages/mentorship/${mentorshipId}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageContent = newMessage.trim();
    setNewMessage(""); // Clear immediately for better UX
    setSending(true);
    
    try {
      const response = await api.post('/messages/send', {
        mentorshipId,
        receiverId: otherPerson._id,
        content: messageContent,
      });
      
      console.log('Message sent successfully:', response.data);
      setMessages([...messages, response.data]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      console.error('Error response:', error.response?.data);
      setNewMessage(messageContent); // Restore message on error
      alert(error.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday ' + date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
             date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-card rounded-2xl w-full max-w-2xl h-[600px] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
              {otherPerson.name.charAt(0)}
            </div>
            <div>
              <h3 className="text-foreground font-semibold">{otherPerson.name}</h3>
              <p className="text-foreground/50 text-sm">{otherPerson.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <MessageCircle className="w-12 h-12 text-foreground/20 mb-2" />
              <p className="text-foreground/60">No messages yet</p>
              <p className="text-foreground/40 text-sm">Start the conversation!</p>
            </div>
          ) : (
            <>
              {messages.map((message) => {
                const isMe = message.senderId._id === user?.id;
                return (
                  <div
                    key={message._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                      <div
                        className={`rounded-2xl px-4 py-2 ${
                          isMe
                            ? 'bg-blue-500 text-white'
                            : 'glass-dark text-foreground'
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                      </div>
                      <span className="text-xs text-foreground/40 mt-1 px-2">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 glass-dark rounded-full px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400/50"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-full px-6 py-3 transition-all flex items-center gap-2"
            >
              {sending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Send
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MentorshipChat;
