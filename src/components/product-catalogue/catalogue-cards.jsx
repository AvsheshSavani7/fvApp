import React from "react";
import PropTypes from "prop-types";
import { PaginatedCards } from "./paginated-cards";

function CatalogueCards(props) {
  const {
    data,
    onSelectItem,
    selectedItems,
    highlightedItems,
    onLoad,
    visible,
  } = props;

  React.useLayoutEffect(() => {
    onLoad((args) => args);
  }, [onLoad]);

  if (!visible) return null;
  return (
    <PaginatedCards
      data={data}
      onSelectItem={onSelectItem}
      selectedItems={selectedItems}
      highlightedItems={highlightedItems}
      key={data?.length}
    />
  );
}

CatalogueCards.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
  highlightedItems: PropTypes.array,
  visible: PropTypes.bool,
  onLoad: PropTypes.func,
};

CatalogueCards.defaultProps = {
  data: [],
  onSelectItem: () => {},
  selectedItems: null,
  highlightedItems: [],
  visible: true,
  onLoad: () => {},
};

export { CatalogueCards };
