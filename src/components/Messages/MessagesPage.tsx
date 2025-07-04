import React, { useState } from 'react';
import { MessageCircle, Send, ArrowLeft } from 'lucide-react';
import { Button } from '../UI/Button';
import { Input } from '../UI/Input';
import { useStore } from '../../store/useStore';

export const MessagesPage: React.FC = () => {
  const { messages, users, currentUser, addMessage, darkMode } = useStore();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Get conversations
  const conversations = users
    .filter(user => user.id !== currentUser?.id)
    .map(user => {
      const userMessages = messages.filter(
        msg => 
          (msg.senderId === currentUser?.id && msg.receiverId === user.id) ||
          (msg.senderId === user.id && msg.receiverId === currentUser?.id)
      );
      const lastMessage = userMessages[userMessages.length - 1];
      const unreadCount = userMessages.filter(
        msg => msg.receiverId === currentUser?.id && !msg.read
      ).length;

      return {
        user,
        lastMessage,
        unreadCount,
        messages: userMessages,
      };
    })
    .filter(conv => conv.messages.length > 0)
    .sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime();
    });

  const selectedConversation = conversations.find(conv => conv.user.id === selectedChat);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !currentUser) return;

    addMessage({
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedChat,
      content: newMessage.trim(),
      timestamp: new Date(),
      read: false,
    });

    setNewMessage('');
  };

  if (selectedChat && selectedConversation) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
        {/* Chat Header */}
        <div className={`sticky top-0 z-40 ${
          darkMode ? 'bg-dark-bg border-gray-800' : 'bg-white border-gray-200'
        } border-b px-4 py-3`}>
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => setSelectedChat(null)}
              variant="ghost"
              size="sm"
              icon={ArrowLeft}
            />
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center">
              <span className="text-white font-bold">
                {selectedConversation.user.artistName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                {selectedConversation.user.artistName}
              </h2>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                @{selectedConversation.user.instagram}
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 px-4 py-6 space-y-4">
          {selectedConversation.messages.map((message) => {
            const isOwn = message.senderId === currentUser?.id;
            
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-gradient-to-r from-primary-green to-primary-purple text-white'
                      : darkMode
                      ? 'bg-gray-800 text-dark-text'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    isOwn ? 'text-white/70' : darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Message Input */}
        <div className={`sticky bottom-0 ${
          darkMode ? 'bg-dark-bg border-gray-800' : 'bg-white border-gray-200'
        } border-t px-4 py-3`}>
          <div className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className={`flex-1 px-4 py-2 border rounded-full ${
                darkMode 
                  ? 'border-gray-600 bg-gray-800 text-dark-text placeholder-gray-400'
                  : 'border-gray-300 bg-white text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-primary-green focus:border-transparent`}
            />
            <Button
              onClick={handleSendMessage}
              variant="primary"
              size="sm"
              icon={Send}
              disabled={!newMessage.trim()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-white'} pb-20`}>
      <div className="px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MessageCircle className="text-primary-green mr-2" size={32} />
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
              Messages
            </h1>
          </div>
        </div>

        {/* Conversations */}
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <button
              key={conversation.user.id}
              onClick={() => setSelectedChat(conversation.user.id)}
              className={`w-full p-4 rounded-xl border ${
                darkMode ? 'border-gray-700 bg-gray-800 hover:bg-gray-700' : 'border-gray-200 bg-white hover:bg-gray-50'
              } transition-colors text-left`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-green to-primary-purple flex items-center justify-center">
                  <span className="text-white font-bold">
                    {conversation.user.artistName.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold truncate ${darkMode ? 'text-dark-text' : 'text-gray-900'}`}>
                      {conversation.user.artistName}
                    </h3>
                    {conversation.lastMessage && (
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {conversation.lastMessage.timestamp.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className={`text-sm truncate ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {conversation.lastMessage?.content || 'No messages yet'}
                    </p>
                    {conversation.unreadCount > 0 && (
                      <span className="bg-primary-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center ml-2">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {conversations.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className={`mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} size={48} />
            <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No conversations yet
            </h3>
            <p className={`${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              Start chatting with other artists in the lobby
            </p>
          </div>
        )}
      </div>
    </div>
  );
};