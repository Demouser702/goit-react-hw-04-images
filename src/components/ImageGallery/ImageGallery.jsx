import React, { useState } from 'react';
import ImageGalleryItem from 'components/ImageGalleryItem/ImageGalleryItem';
import styles from './ImageGallery.module.css';
import Modal from '../Modal/Modal';
import Loader from '../Loader/Loader';

const ImageGallery = ({ images }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpenModal = async selectedImage => {
    try {
      setIsImageModalOpen(true);
      setSelectedImage(selectedImage);
      setIsLoading(true);
    } catch (error) {
      console.error('Error opening modal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
    setIsLoading(false);
  };

  return (
    <ul className={styles.ImageGallery}>
      {images.map(({ id, webformatURL, largeImageURL }) => (
        <ImageGalleryItem
          key={id}
          webformatURL={webformatURL}
          largeImage={largeImageURL}
          onClick={() => handleOpenModal({ id, largeImageURL })}
        />
      ))}

      {isImageModalOpen && selectedImage && (
        <Modal isOpen={isImageModalOpen} handleClose={handleCloseModal}>
          {isLoading ? (
            <Loader />
          ) : (
            <img
              src={selectedImage.largeImageURL}
              alt="Large version"
              onLoad={() => setIsLoading(false)}
            />
          )}
        </Modal>
      )}
    </ul>
  );
};

export default ImageGallery;
