import { useEffect, useState } from 'react';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { FeatureAnnouncementModal } from './FeatureAnnouncementModal';
import { useAuth } from '@/hooks/useAuth';

export function AnnouncementsProvider() {
  const { user } = useAuth();
  const { unreadAnnouncements, markAsRead, isMarkingAsRead } = useAnnouncements();
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (unreadAnnouncements.length > 0 && user) {
      setCurrentAnnouncementIndex(0);
      setIsModalOpen(true);
    }
  }, [unreadAnnouncements.length, user]);

  const handleConfirm = async () => {
    const currentAnnouncement = unreadAnnouncements[currentAnnouncementIndex];
    if (!currentAnnouncement) return;

    try {
      await markAsRead(currentAnnouncement.id);

      // Se houver mais avisos, mostrar o próximo
      if (currentAnnouncementIndex < unreadAnnouncements.length - 1) {
        setCurrentAnnouncementIndex(currentAnnouncementIndex + 1);
      } else {
        setIsModalOpen(false);
        setCurrentAnnouncementIndex(0);
      }
    } catch (error) {
      console.error('Error marking announcement as read:', error);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const currentAnnouncement = unreadAnnouncements[currentAnnouncementIndex];

  if (!currentAnnouncement || !isModalOpen) {
    return null;
  }

  return (
    <FeatureAnnouncementModal
      announcement={currentAnnouncement}
      isOpen={isModalOpen}
      onConfirm={handleConfirm}
      onClose={handleClose}
      isLoading={isMarkingAsRead}
    />
  );
}
