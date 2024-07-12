import React from "react";
import PropTypes from "prop-types";
import ReactPaginate from "react-paginate";
import { Constants } from "../../utils/Constants";
import SingleCard from "./single-card";

function PaginatedCards(props) {
  const {
    data,
    onSelectItem,
    selectedItems,
    highlightedItems,
    itemsPerPage,
    marked,
  } = props;

  // const bindDropable = useDragDropItem()

  const [itemOffset, setItemOffset] = React.useState(0);

  const removeProductCode = React.useCallback((title) => {
    // it's in parentheses ()
    if (!title) return title;
    const splitcode = title.split("(");
    splitcode.splice(splitcode.length - 1, 1);
    return splitcode?.join("(") || "";
  }, []);

  const { currentItems, pageCount } = React.useMemo(() => {
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = data.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(data.length / itemsPerPage);

    const currentItemsWithoutProductCode = currentItems?.map((item) => ({
      ...item,
      title: removeProductCode(item.title),
    }));
    return { currentItems: currentItemsWithoutProductCode, pageCount };
  }, [data, itemOffset, itemsPerPage, removeProductCode]);

  const handlePageClick = React.useCallback(
    (event) => {
      const newOffset = (event.selected * itemsPerPage) % data.length;
      setItemOffset(newOffset);
    },
    [data.length, itemsPerPage]
  );

  return (
    <>
      {currentItems?.length > 0 && (
        <div
          style={{
            // height: '64vh',
            // overflow: 'auto',
            display: "flex",
            flexDirection: "column",
            alignItems: "start",
            width: "100%",
            // height: 'calc(100vh - 45%)',
            // overflowY: 'auto',
          }}
        >
          {currentItems?.map((item) => (
            <SingleCard
              key={item?.id}
              item={item}
              highlighted={highlightedItems?.includes(item?.id)}
              onSelectItem={onSelectItem}
              selected={selectedItems?.includes(item?.id)}
              marked={marked}
              // dropable={bindDropable({
              //   id: item.id,
              //   title: item.title,
              //   price: item.price,
              //   unit: item.unit,
              // })}
              images={item.images}
            />
          ))}
        </div>
      )}
      {data.length > itemsPerPage && (
        <div className="bg-gray-400 rounded-lg mt-4">
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="<"
            renderOnZeroPageCount={null}
            className="pagination"
          />
        </div>
      )}
    </>
  );
}

PaginatedCards.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
  highlightedItems: PropTypes.array,
  itemsPerPage: PropTypes.number,
  marked: PropTypes.arrayOf(PropTypes.string),
};

PaginatedCards.defaultProps = {
  data: [],
  onSelectItem: () => {},
  selectedItems: [],
  highlightedItems: [],
  itemsPerPage: Math.floor(Constants.MAX_PRODUCT_ITEMS_HEIGHT / 55),
  marked: [],
};

export { PaginatedCards };
