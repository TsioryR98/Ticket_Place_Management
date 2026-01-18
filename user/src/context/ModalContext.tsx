'use client';

import { useContext, useState, createContext, ReactNode } from 'react';

interface ModalContextProps {
  openModal: boolean;
  loginOpenModal: () => void;
  closeModal: () => void;
}

const ModalNavContext = createContext<ModalContextProps | undefined>(undefined);

const LoginModalContext = ({ children }: { children: ReactNode }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  const loginOpenModal = () => {
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  return (
    <ModalNavContext.Provider value={{ closeModal, openModal, loginOpenModal }}>
      {children}
    </ModalNavContext.Provider>
  );
};

const useLoginModal = () => {
  const context = useContext(ModalNavContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

export { useLoginModal, LoginModalContext };
