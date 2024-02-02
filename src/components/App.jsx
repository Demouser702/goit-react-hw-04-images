import React, { useEffect, useState } from 'react';
import ImageApi from './service/ImageApi';
import ImageGallery from './ImageGallery/ImageGallery';
import SearchBar from './SearchBar/SearchBar';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import PropTypes from 'prop-types';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const fetchQuery = async (page, query) => {
      try {
        let result = await ImageApi.retrieveImages(query, page);
        let data = result.data;
        let totalHits = data.totalHits;
        let images = data.hits;
        let imagesToLoad = isNaN(totalHits) ? 0 : totalHits - 12 * page;

        if (images.length === 0) {
          setLoadMore(false);
          setIsLoading(false);
          return;
        } else {
          setImages(prevImages => [...prevImages, ...images]);
          setIsLoading(false);
          setLoadMore(page < Math.ceil(totalHits / 12));
        }
        if (images.length > 0 && page === 1) {
          return <span>Hooray! We found ${totalHits} images</span>;
        }

        imagesToLoad > 0 ? setLoadMore(true) : setLoadMore(false);
      } catch (error) {
        console.error('Error retrieving images:', error);
      } finally {
        setIsLoading(false);
      }
    };
    if (searchTerm.trim() !== '') {
      setIsLoading(true);
      setPage(1);
      setImages([]);
      fetchQuery(page, searchTerm);
    }
  }, [searchTerm, page]);
  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
    setIsLoading(true);
  };
  const onSubmit = term => {
    const query = typeof term === 'string' ? term : term.query;
    if (query.trim && query.trim() !== '') {
      setImages([]);
      setSearchTerm(query);
      setPage(1);
    }
  };
  return (
    <div className="App">
      <SearchBar onSubmit={onSubmit} />
      {images.length === 0}
      <div className="gallery_container">
        <ImageGallery images={images} />
      </div>
      <div className="loadmore_section">
        {loadMore && (
          <Button className="loadMore_button" action={handleLoadMore}>
            Load more
          </Button>
        )}
      </div>

      {isLoading && <Loader />}
    </div>
  );
};
App.propTypes = {
  searchTerm: PropTypes.string,
  images: PropTypes.array,
  isLoading: PropTypes.bool,
  page: PropTypes.number,
  loadMore: PropTypes.bool,
};

export default App;
