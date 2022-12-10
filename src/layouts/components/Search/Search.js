import { useEffect, useState, useRef, useContext } from 'react';
import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import 'tippy.js/dist/tippy.css';
import HeadlessTippy from '@tippyjs/react/headless';
import { Wrapper as PopperWrapper } from '~/components/Popper';
import SearchItem from '~/components/SearchItem';
import { useDebounce } from '~/hooks';
// import * as searchServices from '~/services/searchService';

import { faCircleXmark, faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { ProductContext } from '~/contexts/ProductContext';

const cx = classNames.bind(styles);

function Search() {
  const [searchResult, setSearchResult] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [showResult, setShowResult] = useState(true);
  const [loading, setLoading] = useState(false);
  const debouncedValue = useDebounce(searchValue, 500);

  const {
    productState: { products, productLoading },
    getProducts,
  } = useContext(ProductContext);

  const inputRef = useRef();

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line
  }, [productLoading]);

  useEffect(() => {
    if (!debouncedValue.trim()) {
      setSearchResult([]);
      return;
    }

    const fetchApi = () => {
      setLoading(true);
      const result = products.filter(
        (product) =>
          product.description.toLowerCase().includes(searchValue) ||
          product.name.toLowerCase().includes(searchValue) ||
          product._id.toLowerCase().includes(searchValue),
      );
      // const result = await searchServices.search(debouncedValue);
      setSearchResult(result);
      setLoading(false);
    };

    fetchApi();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  const handleHideResult = () => {
    setShowResult(false);
  };

  const handleChange = (e) => {
    const searchValue = e.target.value;
    if (!searchValue.startsWith(' ')) {
      setSearchValue(searchValue);
    }
  };

  return (
    //Using a wrapper <div> or <span> tag around the reference
    //element solves this by creating a new parentNode context.
    <div>
      <HeadlessTippy
        visible={showResult && searchResult.length > 0}
        interactive
        render={(attrs) => (
          <div className={cx('search-result')} tabIndex="-1" {...attrs}>
            <PopperWrapper>
              <h4 className={cx('search-title')}> Sản phẩm</h4>
              {searchResult.map((result) => (
                <SearchItem key={result.slug} data={result} onClick={handleHideResult}></SearchItem>
              ))}
            </PopperWrapper>
          </div>
        )}
        onClickOutside={handleHideResult}
      >
        <div className={cx('search')}>
          <input
            ref={inputRef}
            className={cx('input')}
            placeholder="Nhập tên sản phẩm"
            spellCheck={false}
            value={searchValue}
            onChange={handleChange}
            onFocus={() => setShowResult(true)}
          ></input>

          {!!searchValue && !loading && (
            <button
              className={cx('clear')}
              onClick={() => {
                setSearchValue('');
                inputRef.current.focus();
              }}
            >
              <FontAwesomeIcon icon={faCircleXmark} />
            </button>
          )}

          {loading && <FontAwesomeIcon className={cx('loading')} icon={faSpinner} />}
          <div className={cx('split')}></div>
          <button className={cx('search-btn')} onMouseDown={(e) => e.preventDefault()}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
      </HeadlessTippy>
    </div>
  );
}

export default Search;
