import React from "react";
import { Input, Button } from "antd";
import PropTypes from "prop-types";
import { BsSearch } from "react-icons/bs";
import { Constants } from "../../utils/Constants";

function Search(props) {
  const { onSearching, onClear, disabledClear } = props;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "8px",
        marginTop: "8px",
        width: "100%",
        backgroundColor: "#00000033",
        borderRadius: "8px",
        height: "40px",
      }}
    >
      <Input.Search
        // placeholder="Search Products"
        allowClear
        onChange={onSearching}
        style={{ width: "100%", margin: "0 1px", color: "black" }}
        enterButton={null}
        prefix={
          <BsSearch
            style={{
              color: "black",
              fontSize: "14px",
              fontWeight: "bold",
              marginLeft: "6px",
              marginRight: "4px",
            }}
          />
        }
        className="product_search"
      />
      {onClear && (
        <Button onClick={onClear} ghost disabled={disabledClear}>
          <span style={{ color: "white" }}>Clear</span>
        </Button>
      )}
    </div>
  );
}

Search.propTypes = {
  onSearching: PropTypes.func,
  onClear: PropTypes.func,
  disabledClear: PropTypes.bool,
};

Search.defaultProps = {
  onSearching: () => {},
  onClear: null,
  disabledClear: true,
};

export default Search;
