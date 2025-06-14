import React, { useContext, useState, useEffect } from "react";
import { fetchDataFromExternalAPI } from "../utils/api";
import { Context } from "../context/contextAPI";
import { useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Product from "./Product";
const SearchResultPage = () => {
  const { searchQuery } = useParams();
  const { loading, setloading } = useContext(Context);
  const [searchResults, setSearchResults] = useState([]);
  useEffect(() => {
    fetchSearchResult();
  }, [searchQuery]);
  const parseExternalProducts = (products) => {
    if (!Array.isArray(products)) return [];

    return products.map((item) => ({
      product_id: item.product_id,
      product_title: item.product_title,
      price: item?.offer?.price,
      image: item?.product_photos[0],
      lastUpdated: new Date(),
    }));
  };

  const fetchSearchResult = () => {
    setloading(true);
    fetchDataFromExternalAPI(
      `search-v2?q=${searchQuery}&country=in&language=en&limit=90&sort_by=BEST_MATCH&product_condition=NEW`
    )
      .then((response) => {
        const newProducts = parseExternalProducts(response?.data?.products);
        if (newProducts.length === 0) {
          setSearchResults([]);
          setloading(false);
          return;
        }
        setSearchResults(newProducts);
        setloading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div>
      <section id="search-header" className="h-[30vh] md:h-[40vh]">
        <h5 className="font-serif font text-2xl md:text-3xl lg:text-5xl text-center">
          #Results for{" "}
          <span className="text-[#ff0d00] font-mono font-bold">
            {searchQuery}
          </span>
        </h5>
      </section>
      <section
        id="product1"
        className="py-[40px] px-0 sm:px-[20px] lg:px-[80px] text-center"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 min-[1350px]:grid-cols-4 gap-8 sm:gap-16 justify-center">
          <SkeletonTheme baseColor="#D0D4CA" highlightColor="#7D7C7C">
            {loading
              ? Array.from({ length: 50 }).map((_, index) => (
                  <div className="flex justify-center" key={index}>
                    <Skeleton
                      key={index}
                      duration={2}
                      borderRadius="1rem"
                      width="16rem"
                      height="25rem"
                    ></Skeleton>
                  </div>
                ))
              : searchResults?.map((item) => {
                  return <Product key={item.product_id} product={item} />;
                })}
          </SkeletonTheme>
        </div>
      </section>
    </div>
  );
};

export default SearchResultPage;
