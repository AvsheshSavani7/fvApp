import React from "react";
import PropTypes from "prop-types";
import "./style.css";
import { FolderCards } from "./folder-cards";

function CatalogueFolders(props) {
  const { data, ...restProps } = props;

  return (
    <div className="w-full">
      <FolderCards data={data} key={data.length} {...restProps} />
    </div>
  );
}

CatalogueFolders.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
  highlightedItems: PropTypes.array,
};

CatalogueFolders.defaultProps = {
  data: [],
  onSelectItem: () => {},
  selectedItems: null,
  highlightedItems: [],
};

export { CatalogueFolders };
