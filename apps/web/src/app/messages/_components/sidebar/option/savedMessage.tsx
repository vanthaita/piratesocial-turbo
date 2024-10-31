import { ArrowLeft } from 'lucide-react';
import React from 'react';

interface MyProfileProps {
  showSavedMessages: boolean;
  setShowSavedMessages: React.Dispatch<React.SetStateAction<boolean>>;
  isShowOptionProfile: boolean;
  setIShowOptionProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const savedMessages = [
  {
    title: 'Message Title 1',
    snippet: 'This is a short snippet of the saved message...',
    received: '2 days ago',
  },
  {
    title: 'Message Title 2',
    snippet: 'Another snippet of the saved message...',
    received: '3 days ago',
  },
];

const SavedMessages: React.FC<MyProfileProps> = ({ showSavedMessages, setShowSavedMessages,setIShowOptionProfile }) => {
  if (!showSavedMessages) return null;

  return (
    <aside className="bg-white shadow-md overflow-y-auto fixed sidebar z-20 w-full h-full">
      <div className="flex justify-between px-6 py-4 items-center border-b">
        <h2 className="text-lg font-semibold text-gray-700">Saved Messages</h2>
        <ArrowLeft
          onClick={() => {
            setShowSavedMessages(false)
            setIShowOptionProfile(false)
          }}
          className="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800 transition-all duration-300"
        />
      </div>

      <div className="p-4 border-b">
        <input
          type="text"
          placeholder="Search messages..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="p-4">
        {savedMessages.map((message, index) => (
          <div
            key={index}
            className="mb-4 p-3 border rounded cursor-pointer transition-all duration-300 relative"
          >
            <h3 className="text-md font-medium text-gray-800">{message.title}</h3>
            <p className="text-sm text-gray-600">{message.snippet}</p>
            <span className="text-xs text-gray-500">{message.received}</span>
            <button
              className="absolute right-0 bottom-0 text-xs hover:bg-gray-200 p-2"
              onClick={() => {
                navigator.clipboard.writeText(`${message.title}\n${message.snippet}`);
                alert('Message copied to clipboard!');
              }}
            >
                Copy
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default SavedMessages;
