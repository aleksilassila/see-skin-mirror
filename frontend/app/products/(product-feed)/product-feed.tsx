"use client";
import { useInfiniteQuery } from "react-query";
import fetchProductsFeed from "../../(api)/products/fetch-products-feed";
import ProductItem from "./product-item";
import { ProductFiltersState } from "../(product-filters)/product-filters";
import { ProductSearchState } from "../(product-search)/product-search";
import classNames from "classnames";
import ProductFeedLoader, { useProductFeedLoader } from "./product-feed-loader";
import { Product } from "../../(api)/types";
import { useEffect, useState } from "react";
import { ProductDetailsState } from "../(product-details)/product-details";

interface Props {
  filterState: ProductFiltersState;
  searchState: ProductSearchState;
  productDetailsState: ProductDetailsState;
}

function useDirtyInfiniteQueryServerFix() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => setEnabled(true), []);

  return enabled;
}

export default function ProductFeed({
  filterState,
  searchState,
  productDetailsState,
}: Props) {
  const infiniteQueryServerFix = useDirtyInfiniteQueryServerFix(); // FIXME remove this when react-query is fixed
  const { data, fetchNextPage, isFetching } = useInfiniteQuery<Product[]>(
    ["products", { searchStr: searchState.searchStr }],
    async ({ pageParam = 0, queryKey }) =>
      fetchProductsFeed(pageParam, searchState.getSearchStr()),
    {
      getNextPageParam: (lastPage, allPages) => {
        return allPages.length;
      },
      enabled: infiniteQueryServerFix,
    }
  );

  const feedLoader = useProductFeedLoader(fetchNextPage);

  const gridClassName = classNames(
    "flex flex-wrap justify-center",
    "max-w-screen-2xl mx-auto",
    "gap-2 p-2",
    "overflow-y-scroll"
  );

  return (
    <div className={gridClassName}>
      {data?.pages.flat().map((product, key) => (
        <ProductItem
          setProductDetails={productDetailsState.setProduct}
          product={product}
          key={key}
        />
      ))}
      <ProductFeedLoader loaderRef={feedLoader.ref} isLoading={isFetching} />
    </div>
  );
}
