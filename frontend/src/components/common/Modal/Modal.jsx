import React, { useEffect } from "react";
import { FiX } from "react-icons/fi";

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md", // 'sm', 'md', 'lg', 'xl'
}) => {
  // Empêcher le scroll du body quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Centre la modal */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
          &#8203;
        </span>

        {/* Modal */}
        <div
          className={`inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${sizeClasses[size]} w-full`}
        >
          {/* En-tête */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 focus:outline-none"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Contenu */}
          <div className="px-6 py-4">{children}</div>

          {/* Pied de page */}
          {footer && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
