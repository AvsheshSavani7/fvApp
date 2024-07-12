import React from "react";
import PropTypes from "prop-types";
import SearchField from "../UI/SearchField";

const SearchAndAdd = ({ onChange }) => {
  return (
    <div className="mb-8">
      <SearchField onChange={onChange} />
    </div>
  );
};

export default SearchAndAdd;

SearchAndAdd.propTypes = {
  onChange: PropTypes.func,
};
