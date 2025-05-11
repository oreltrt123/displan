
import React from 'react';
import { AlertTriangle } from 'lucide-react';

type MessageType = 'user' | 'bot';

interface ChatMessageProps {
  message: string;
  type: MessageType;
  isError?: boolean;
}

const ChatMessage = ({ message, type, isError = false }: ChatMessageProps) => {
  return (
    <div className={`flex w-full mb-4 ${type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          type === 'user'
            ? 'bg-blue-500 text-white rounded-tr-none'
            : isError
              ? 'bg-red-50 text-red-800 border border-red-200 rounded-tl-none'
              : 'bg-gray-100 text-gray-800 rounded-tl-none'
        }`}
      >
        {isError && (
          <div className="flex items-center gap-1 mb-1">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-xs font-medium text-red-500">Error</span>
          </div>
        )}
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
