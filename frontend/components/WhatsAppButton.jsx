'use client'

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-3 px-3 py-1 bg-gray-800 text-white text-sm rounded-md whitespace-nowrap shadow-lg">
          Chat on WhatsApp
        </div>
      )}
      <a
        href="https://wa.me/919314072153?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20Second%20Innings"
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg text-white hover:bg-green-600 transition-colors relative"
        aria-label="Chat on WhatsApp"
      >
        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping"></span>
        <MessageCircle size={32} className="relative" />
      </a>
    </div>
  );
}
