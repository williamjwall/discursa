import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

const Tooltip = ({ 
  children, 
  content, 
  position = 'top',
  delay = 500,
  className,
  contentClassName,
  disabled = false
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const timeoutRef = useRef();
  const triggerRef = useRef();
  const tooltipRef = useRef();

  const positions = {
    top: {
      tooltip: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
      arrow: 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900'
    },
    bottom: {
      tooltip: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
      arrow: 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900'
    },
    left: {
      tooltip: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
      arrow: 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900'
    },
    right: {
      tooltip: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
      arrow: 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900'
    }
  };

  const checkPosition = () => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    let newPosition = position;

    // Check if tooltip would go outside viewport and adjust
    if (position === 'top' && rect.top < 100) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && rect.bottom > viewport.height - 100) {
      newPosition = 'top';
    } else if (position === 'left' && rect.left < 200) {
      newPosition = 'right';
    } else if (position === 'right' && rect.right > viewport.width - 200) {
      newPosition = 'left';
    }

    setActualPosition(newPosition);
  };

  const showTooltip = () => {
    if (disabled) return;
    
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      checkPosition();
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!content) return children;

  return (
    <div 
      className={cn('relative inline-block', className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
      ref={triggerRef}
    >
      {children}
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap pointer-events-none',
              positions[actualPosition].tooltip,
              contentClassName
            )}
          >
            {content}
            
            {/* Arrow */}
            <div 
              className={cn(
                'absolute w-0 h-0 border-4',
                positions[actualPosition].arrow
              )}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Tooltip }; 