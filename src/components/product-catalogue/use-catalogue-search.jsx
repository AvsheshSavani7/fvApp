import React from "react";
import { useSearchData } from "./use-search-data";

function useCatalogueSearch(props) {
  const { data } = props;
  const [searchTokens, setSearchTokens] = React.useState([]);
  const [foundData, setFoundData] = React.useState([]);
  const { indexing, search } = useSearchData();
  const indicesRef = React.useRef(null);

  // Perform indexing on load
  React.useEffect(() => {
    if (!data?.length) return;
    // Index only the title of the product
    indicesRef.current = indexing(data.map((item) => item.title));
  }, [data, indexing]);

  const onSearch = React.useCallback(
    (value, filter) => {
      if (value && indicesRef.current) {
        const { result, tokens } = search(value, indicesRef.current, data);
        setSearchTokens(tokens || []);
        const finalResult = filter ? filter(result) : result;
        setFoundData(finalResult || []);
      } else {
        setSearchTokens([]);
        setFoundData(data);
      }
    },
    [data, search]
  );

  const onClear = React.useCallback(() => {
    setSearchTokens([]);
    setFoundData([]);
  }, []);

  return { onSearch, searchTokens, foundData, onClear };
}

export { useCatalogueSearch };
