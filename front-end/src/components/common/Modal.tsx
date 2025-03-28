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
  if (!isOpen) return <></>;

  return (
    isOpen && (
      <div className="fixed-container inset-0 left-1/2 z-50 flex -translate-x-1/2 items-center justify-center">
        <div className="fixed-container inset-0 bg-black opacity-60" onClick={onClose}></div>
        <div
          className={`fixed flex flex-col items-center p-6 ${position === 'center' ? 'top-1/2 left-1/2 w-80 -translate-x-1/2 -translate-y-1/2 transform' : 'bottom-0 left-1/2 mx-4 w-4/5 -translate-x-1/2 transform'} rounded-modal bg-white shadow-lg`}
        >
          {title && (
            <div>
              <p>{title}</p>
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
