import { useState } from "react";
import { Keyboard, X } from "lucide-react";

interface TamilKeyboardProps {
  onKeyPress: (key: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

export function TamilKeyboard({ onKeyPress, onClose, isVisible }: TamilKeyboardProps) {
  const [currentLayout, setCurrentLayout] = useState<'tamil' | 'english'>('tamil');

  // Tamil keyboard layouts with more comprehensive characters
  const tamilLayout = [
    ['அ', 'ஆ', 'இ', 'ஈ', 'உ', 'ஊ', 'எ', 'ஏ', 'ஐ', 'ஒ', 'ஓ', 'ஔ'],
    ['க', 'ங', 'ச', 'ஞ', 'ட', 'ண', 'த', 'ந', 'ப', 'ம', 'ய', 'ர'],
    ['ல', 'வ', 'ழ', 'ள', 'ற', 'ன', 'ஜ', 'ஷ', 'ஸ', 'ஹ', 'க்ஷ', 'ஸ்ரீ'],
    ['ா', 'ி', 'ீ', 'ு', 'ூ', 'ெ', 'ே', 'ை', 'ொ', 'ோ', 'ௌ', '்'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '.', ','],
    ['Space', 'Backspace']
  ];

  const englishLayout = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Space', 'Backspace']
  ];

  const currentKeys = currentLayout === 'tamil' ? tamilLayout : englishLayout;

  const handleKeyPress = (key: string) => {
    if (key === 'Space') {
      onKeyPress(' ');
    } else if (key === 'Backspace') {
      onKeyPress('BACKSPACE');
    } else {
      onKeyPress(key);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
      <div className="p-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Keyboard className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">Virtual Keyboard</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentLayout(currentLayout === 'tamil' ? 'english' : 'tamil')}
            className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            {currentLayout === 'tamil' ? 'A' : 'அ'}
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="p-2 space-y-1">
        {currentKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1">
            {row.map((key, keyIndex) => (
              <button
                key={keyIndex}
                onClick={() => handleKeyPress(key)}
                className={`px-3 py-2 text-sm font-medium rounded border transition-colors ${
                  key === 'Space'
                    ? 'flex-1 min-w-[120px] bg-gray-100 hover:bg-gray-200 border-gray-300'
                    : key === 'Backspace'
                    ? 'bg-red-100 hover:bg-red-200 border-red-300 text-red-700'
                    : 'bg-white hover:bg-blue-50 border-gray-300 hover:border-blue-300 min-w-[35px]'
                }`}
              >
                {key === 'Space' ? 'Space' : key === 'Backspace' ? '⌫' : key}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}