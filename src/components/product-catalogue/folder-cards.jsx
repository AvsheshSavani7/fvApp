import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { AiFillFolder, AiFillHome } from "react-icons/ai";
import { Breadcrumb, Card } from "antd";
import { PaginatedCards } from "./paginated-cards";
import { Constants } from "../../utils/Constants";
import { useDispatch } from "react-redux";
import { onProductSelection } from "../../redux/product";

const SEPARATOR = "/";
const enableHybridAtRoot = false;

function FolderCards(props) {
  const { data, visible, onLoad, onNavigate, ...restProps } = props;
  const [path, setPath] = React.useState("");
  const pathRef = React.useRef(path);
  React.useLayoutEffect(() => {
    pathRef.current = path;
  }, [path, pathRef]);

  const dispatch = useDispatch();

  const getItemPath = React.useCallback((item, parent) => {
    if (!parent) return item;
    return `${parent}${SEPARATOR}${item}`;
  }, []);

  const folderData = React.useMemo(() => {
    let folderData = path
      ? data?.filter(
          (item) => item?.Folder?.startsWith(path) && item.Folder !== path
        )
      : data;
    // We only need the folder names
    folderData = folderData
      ?.map((item) => {
        let folderName = item.Folder;
        if (!folderName) return null;
        if (path) {
          // Exclude the current path
          folderName = folderName.replace(`${path}${SEPARATOR}`, "");
        }
        // Remove the grand-children folder
        const splitted = folderName.split(SEPARATOR);
        // eslint-disable-next-line prefer-destructuring
        folderName = splitted[0];
        return folderName;
      })
      ?.filter((item) => !!item);

    // Remove duplicate entries
    folderData = [...new Set(folderData)];
    // Create clickable objects for folders
    return folderData?.map((item) => ({
      item,
      parent: path,
      path: getItemPath(item, path),
    }));
  }, [data, getItemPath, path]);

  const filteredData = React.useMemo(
    () =>
      data?.filter((item) => item.Folder === path || (!item.Folder && !path)),
    [data, path]
  );

  const breadcrumbs = React.useMemo(() => {
    const splitted = path?.split(SEPARATOR) || [];
    let parent = "";
    const breadcrumbs = [];
    splitted.forEach((item, index, self) => {
      if (index !== 0) {
        if (parent) {
          parent = `${parent}${SEPARATOR}${self[index - 1]}`;
        } else {
          parent = self[index - 1];
        }
      }
      const itemPath = getItemPath(item, parent);
      if (item) breadcrumbs.push({ item, path: itemPath, parent });
    });
    breadcrumbs.unshift({
      item: (
        <AiFillHome style={{ color: Constants.TEXT_COLOR, fontSize: "18px" }} />
      ),
      path: "",
      parent: "",
    });
    return breadcrumbs;
  }, [getItemPath, path]);

  const onClick = React.useCallback(
    (state) => {
      setPath(state.path);
      onNavigate();
    },
    [onNavigate]
  );

  const checkInScope = React.useCallback((foundData) => {
    const result = foundData?.filter(
      (item) =>
        item?.Folder?.startsWith(pathRef.current) ||
        (!item.Folder && !pathRef.current)
    );
    return result;
  }, []);

  React.useEffect(() => {
    onLoad((args) => checkInScope(args));
  }, [checkInScope, onLoad]);

  const isRoot = breadcrumbs.length < 2;
  const isFolderDataVisible = visible && !!folderData?.length;
  const isItemDataVisible = visible && !!filteredData?.length;
  const noHybrid = !isRoot || !isFolderDataVisible || !isItemDataVisible;

  useEffect(() => {
    if (isFolderDataVisible) {
      dispatch(onProductSelection());
    }
  }, [isFolderDataVisible]);

  return (
    <div className="flex flex-col h-full">
      <Breadcrumb
        separator={<span style={{ color: "black" }}> / </span>}
        style={{
          color: "black",
          marginBottom: "8px",
          marginLeft: "10px",
          fontSize: "12px",
          fontFamily: Constants.FONT_FAMILY_POPPINS,
        }}
      >
        {breadcrumbs.map((item) => (
          <Breadcrumb.Item
            style={{ cursor: "pointer", fontSize: "12px !important" }}
            onClick={() => onClick(item)}
          >
            {" "}
            {!isRoot && <>{item.item}</>}{" "}
          </Breadcrumb.Item>
        ))}
      </Breadcrumb>
      {isFolderDataVisible && (
        <div
          style={
            folderData.length > 0
              ? {
                  maxHeight: "calc(100vh - 188px)",
                  overflowY: "auto",
                  backgroundColor: "#00000033",
                  borderRadius: "8px",
                }
              : null
          }
        >
          {folderData.map((item) => (
            <Card
              bordered={false}
              style={{
                width: "100%",
                height: "44px",
                backgroundColor: "transparent",
                margin: "0px 0",
                color: "black",
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                fontFamily: Constants.FONT_FAMILY_POPPINS,
              }}
              bodyStyle={{
                padding: "0px 12px",
                display: "flex",
                justifyContent: "start",
              }}
              onClick={() => onClick(item)}
            >
              <AiFillFolder
                style={{
                  // color: Constants.TEXT_COLOR,
                  color: "#3399ff",
                  fontSize: "20px",
                  marginRight: "6px",
                }}
              />
              <span className="text-left text-[12px] mt-[2px]">
                {item.item}
              </span>
            </Card>
          ))}
        </div>
      )}
      {isItemDataVisible && (enableHybridAtRoot || noHybrid) && (
        <PaginatedCards data={filteredData} {...restProps} />
      )}
    </div>
  );
}

FolderCards.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  onSelectItem: PropTypes.func,
  selectedItems: PropTypes.array,
  highlightedItems: PropTypes.array,
  marked: PropTypes.arrayOf(PropTypes.string),
  onNavigate: PropTypes.func,
  visible: PropTypes.bool,
  onLoad: PropTypes.func,
};

FolderCards.defaultProps = {
  data: [],
  onSelectItem: () => {},
  selectedItems: [],
  highlightedItems: [],
  marked: [],
  onNavigate: () => {},
  visible: true,
  onLoad: () => {},
};

export { FolderCards };
