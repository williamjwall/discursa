import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Modal = ({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  className,
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[90vw]'
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  "fixed left-[50%] top-[50%] z-50 w-full p-6",
                  sizeClasses[size],
                  className
                )}
                initial={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: '-50%',
                  y: '-50%'
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  x: '-50%',
                  y: '-50%'
                }}
                exit={{ 
                  opacity: 0, 
                  scale: 0.95,
                  x: '-50%',
                  y: '-50%'
                }}
                transition={{ duration: 0.2 }}
              >
                <div className="bg-white rounded-lg shadow-xl">
                  <div className="flex items-start justify-between p-6 border-b">
                    <div>
                      {title && (
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          {title}
                        </Dialog.Title>
                      )}
                      {description && (
                        <Dialog.Description className="mt-1 text-sm text-gray-600">
                          {description}
                        </Dialog.Description>
                      )}
                    </div>
                    <Dialog.Close asChild>
                      <button
                        className="rounded-lg p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                        aria-label="Close"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="p-6">
                    {children}
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
};

export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close; 