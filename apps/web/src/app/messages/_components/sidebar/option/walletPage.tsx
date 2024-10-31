'use client'
import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
interface WalletProps {
  showWallet: boolean;
  setShowWallet: React.Dispatch<React.SetStateAction<boolean>>;
  isShowOptionProfile: boolean;
  setIShowOptionProfile: React.Dispatch<React.SetStateAction<boolean>>;
}

const WalletPage: React.FC<WalletProps> = ({ showWallet, setShowWallet, setIShowOptionProfile }) => {
  const [toncoinPrice, setToncoinPrice] = useState<number>(0);
  const [nfts, setNfts] = useState<any[]>([]);
  if (!showWallet) return null;

  return (
    <aside className="bg-white shadow-md overflow-y-auto fixed sidebar z-20 w-full h-full">
      <div className="flex justify-between px-4 py-3 items-center bg-gray-100 border-b">
        <h2 className="text-xl font-semibold text-gray-800">Wallet</h2>
        <ArrowLeft
          onClick={() => {
            setShowWallet(false)
            setIShowOptionProfile(false)
          }}
          className="cursor-pointer w-6 h-6 text-gray-600 hover:text-gray-800 transition duration-300"
        />
      </div>

      <div className="p-6 bg-white text-center border-b">
        <h3 className="text-3xl font-bold text-gray-900">$0.00</h3>
        <button className="text-blue-600 text-sm mt-2 hover:underline">Add funds +</button>
      </div>

      <div className="flex justify-between p-4 bg-gray-50 border-b">
        <span className="text-gray-600">SUI (sui):</span>
        <span className="font-medium text-gray-900">${toncoinPrice.toFixed(2)}</span>
      </div>

      <div className="flex justify-around p-4 bg-gray-50 border-b">
        <button className="flex flex-col items-center">
          <span className="text-blue-500">⬆ Send</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-blue-500">🔄 Exchange</span>
        </button>
        <button className="flex flex-col items-center">
          <span className="text-blue-500">⬇ Sell</span>
        </button>
      </div>

      <div className="p-6 bg-gray-100">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">My NFTs</h4>
        <div className="grid grid-cols-2 gap-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="bg-white p-3 rounded shadow">
                <Image src={nft.image_url} alt={nft.name} className="w-full h-32 object-cover rounded" />
                <h5 className="text-sm font-semibold text-gray-800 mt-2">{nft.name}</h5>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No NFTs available.</p>
          )}
        </div>
      </div>

      <div className="p-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Ways to add funds</h4>
        <button className="w-full py-2 bg-indigo-500 text-white rounded-md shadow-md hover:bg-indigo-600 transition duration-300">
          Top up using a bank card
        </button>
      </div>
    </aside>
  );
};

export default WalletPage;
