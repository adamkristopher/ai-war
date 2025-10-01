import { ReactNode, useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  children: ReactNode;
  content: string;
  enabled: boolean;
}

export function Tooltip({ children, content, enabled }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [alignment, setAlignment] = useState<'top' | 'right' | 'left'>('top');
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const tooltipWidth = 350; // Approximate max tooltip width
      const centerLeft = rect.left + rect.width / 2;

      // Check if tooltip would be cut off on the left
      if (centerLeft - tooltipWidth / 2 < 10) {
        // Position to the right of the card instead
        setAlignment('right');
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.right + 10,
        });
      } else if (centerLeft + tooltipWidth / 2 > window.innerWidth - 10) {
        // Position to the left of the card
        setAlignment('left');
        setPosition({
          top: rect.top + rect.height / 2,
          left: rect.left - 10,
        });
      } else {
        // Default: center above card
        setAlignment('top');
        setPosition({
          top: rect.top - 8,
          left: centerLeft
        });
      }
    }
  }, [isVisible]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        ref={triggerRef}
        className="inline-block relative"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        style={{ zIndex: 'auto' }}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div
          className="px-6 py-4 bg-white text-black text-lg font-bold rounded-xl pointer-events-none whitespace-nowrap border-4 border-black shadow-2xl"
          style={{
            position: 'fixed',
            top: position.top,
            left: position.left,
            transform: alignment === 'right' ? 'translateY(-50%)' : alignment === 'left' ? 'translate(-100%, -50%)' : 'translate(-50%, -100%)',
            zIndex: 99999,
            boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.8)'
          }}
        >
          {content}
          {/* Tail/pointer based on alignment */}
          {alignment === 'top' && (
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-white" style={{ filter: 'drop-shadow(0px 2px 0px black)' }}></div>
          )}
          {alignment === 'right' && (
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-white" style={{ filter: 'drop-shadow(-2px 0px 0px black)' }}></div>
          )}
          {alignment === 'left' && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-8 border-transparent border-l-white" style={{ filter: 'drop-shadow(2px 0px 0px black)' }}></div>
          )}
        </div>,
        document.body
      )}
    </>
  );
}
