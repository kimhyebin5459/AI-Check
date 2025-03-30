import { Close } from '@/public/icons';
import Image from 'next/image';

type ModalPosition = 'center' | 'bottom';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  position?: ModalPosition;
  title?: string;
  children?: React.ReactNode;
}

const Modal = ({ children, onClose, isOpen, position = 'center', title }: Props) => {
  return (
    isOpen && (
      <div
        className={`fixed-container inset-0 left-1/2 z-50 flex -translate-x-1/2 ${position === 'center' ? 'items-center' : 'items-end'} justify-center`}
      >
        <div className="fixed-container inset-0 bg-black opacity-60" onClick={onClose}></div>
        <div
          className={`z-60 flex w-full flex-col items-center space-y-6 p-6 ${position === 'center' ? 'mx-9' : 'mx-5 mb-10'} rounded-modal bg-white shadow-lg`}
        >
          {title && (
            <div className="flex w-full justify-between">
              <p className="font-semibold">{title}</p>
              <Image src={Close} alt="close icon" onClick={onClose} />
            </div>
          )}
          {children}
        </div>
      </div>
    )
  );
};

export default Modal;
