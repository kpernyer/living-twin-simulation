import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ViewSliderProps {
  views: React.ReactNode[];
  viewTitles: string[];
  currentView: number;
  onViewChange: (viewIndex: number) => void;
  className?: string;
}

export const ViewSlider: React.FC<ViewSliderProps> = ({ 
  views, 
  viewTitles, 
  currentView, 
  onViewChange, 
  className = '' 
}) => {
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = e.targetTouches[0].clientX;
    const diff = currentX - touchStartX;
    setDragOffset(diff);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEndX(e.changedTouches[0].clientX);
    setIsDragging(false);
    setDragOffset(0);
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (!touchStartX || !touchEndX) return;
    
    const swipeDistance = touchStartX - touchEndX;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (swipeDistance > 0 && currentView < views.length - 1) {
      // Swipe left - next view
      onViewChange(currentView + 1);
    } else if (swipeDistance < 0 && currentView > 0) {
      // Swipe right - previous view  
      onViewChange(currentView - 1);
    }
  };

  const nextView = () => {
    if (currentView < views.length - 1) {
      onViewChange(currentView + 1);
    }
  };

  const prevView = () => {
    if (currentView > 0) {
      onViewChange(currentView - 1);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* View Title */}
      <div className="flex items-center justify-between mb-4 px-4">
        <button
          onClick={prevView}
          disabled={currentView === 0}
          className={`p-2 rounded-lg transition-all ${
            currentView === 0 
              ? 'text-slate-400 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          <ChevronLeft size={20} />
        </button>
        
        <div className="flex-1 text-center">
          <h2 className="text-lg font-bold text-orange-400 drop-shadow-lg">
            {viewTitles[currentView]}
          </h2>
          <div className="flex justify-center space-x-2 mt-2">
            {views.map((_, index) => (
              <button
                key={index}
                onClick={() => onViewChange(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentView 
                    ? 'bg-blue-500' 
                    : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>
        
        <button
          onClick={nextView}
          disabled={currentView === views.length - 1}
          className={`p-2 rounded-lg transition-all ${
            currentView === views.length - 1 
              ? 'text-slate-400 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Slider Container */}
      <div 
        ref={sliderRef}
        className="flex transition-transform duration-300 ease-out"
        style={{ 
          transform: `translateX(calc(-${currentView * 100}% + ${isDragging ? dragOffset : 0}px))` 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {views.map((view, index) => (
          <div 
            key={index} 
            className="w-full flex-shrink-0"
          >
            {view}
          </div>
        ))}
      </div>
    </div>
  );
};