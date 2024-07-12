import React from "react";
import { Radio } from "antd";
import { OrderedListOutlined, FolderOpenOutlined } from "@ant-design/icons";
import { CatalogueCards } from "./catalogue-cards";
import { CatalogueFolders } from "./catalogue-folders";
import { PaginatedCards } from "./paginated-cards";
import "./style.css";
import { useCatalogueSearch } from "./use-catalogue-search";
import { onProductSelection } from "../../redux/product";
import { useDispatch, useSelector } from "react-redux";
import Search from "./search";
// import productJson from "../product-catalogue/static-products/product_12th_Mar_24.json";

const options = [
  {
    label: <FolderOpenOutlined />,
    value: "folder",
  },
  {
    label: <OrderedListOutlined />,
    value: "list",
  },
];

const IMAGE_FILEDS = [
  "Swatch_Image_1_URL",
  "Swatch_Image_2_URL",
  "Swatch_Image_3_URL",
  "Swatch_Image_4_URL",
  "Swatch_Image_5_URL",
  "Room_Scene_Image_1_URL",
  "Room_Scene_Image_2_URL",
  "Room_Scene_Image_3_URL",
  "Room_Scene_Image_4_URL",
  "Room_Scene_Image_5_URL",
  "FlooredAtHome_Image_1",
  "FlooredAtHome_Image_2",
  "FlooredAtHome_Image_3",
  "FlooredAtHome_Image_4",
  "FlooredAtHome_Image_5",
];
const legacyRadioGroup = false;

function Catalogue() {
  const products = useSelector((state) => state.productReducer.products);
  // const products = productJson.data;
  const selectedProduct = useSelector(
    (state) => state.productReducer.selectedProduct
  );

  const dispatch = useDispatch();

  const getImages = React.useCallback((product) => {
    const images = [];
    IMAGE_FILEDS.forEach((key) => {
      const url = product[key];
      if (url) {
        images.push({
          key,
          url,
        });
      }
    });
    return images;
  }, []);

  const data = React.useMemo(
    () =>
      products?.map((item) => ({
        ...item,
        title:
          item.Short_Code !== null
            ? `${item.Short_Code} ()`
            : `${item.Product_Name} (${item.Short_Code})`,
        price: item.Unit_Price || 0,
        unit: item.Usage_Unit,
        images: getImages(item),
      })),
    [getImages, products]
  );

  const onProductSelect = React.useCallback(
    (productId) => {
      console.log(productId, "productId");
      // updateProductSelection(activeRoomId, productId)
      if (selectedProduct === productId) {
        dispatch(onProductSelection());
      } else {
        dispatch(onProductSelection(productId));
      }
    },
    [selectedProduct, onProductSelection]
  );

  const [mode, setMode] = React.useState("folder");
  const onModeChange = React.useCallback(({ target: { value } }) => {
    setMode(value);
  }, []);

  const onSelectionClear = React.useCallback(() => {
    onProductSelect(null);
  }, [onProductSelect]);

  // Implement search funcationality
  const scopeCheckerRef = React.useRef(null);
  const {
    onSearch,
    searchTokens,
    foundData,
    onClear: onSearchTokenClear,
  } = useCatalogueSearch({ data });

  const searchAndFilter = React.useCallback(
    (event) => {
      const { value } = event?.target || {};

      if (value) {
        onSearch(value, scopeCheckerRef.current);
      } else {
        onSearchTokenClear();
      }
    },
    [onSearch, onSearchTokenClear]
  );

  const hasSearchTokens = !!searchTokens?.length;
  const hasFoundData = !!foundData?.length;

  const catalogueLoad = React.useCallback((checker) => {
    scopeCheckerRef.current = checker;
  }, []);
  const TheCatalogue = mode === "list" ? CatalogueCards : CatalogueFolders;
  const len = data?.length || 0;

  if (!len) return null;
  return (
    <div className="">
      {legacyRadioGroup && (
        <div className="catalogue-radio">
          <Radio.Group
            options={options}
            onChange={onModeChange}
            value={mode}
            optionType="button"
            buttonStyle="solid"
          />
        </div>
      )}
      <Search
        onSearching={searchAndFilter}
        onClear={legacyRadioGroup ? onSelectionClear : null}
        disabledClear={true}
      />
      <TheCatalogue
        key={mode}
        data={data}
        onSelectItem={onProductSelect}
        selectedItems={[]}
        highlightedItems={[]}
        onNavigate={onSearchTokenClear}
        onLoad={catalogueLoad}
        visible={!hasSearchTokens}
      />
      {hasFoundData && hasSearchTokens && (
        <PaginatedCards
          data={foundData}
          onSelectItem={onProductSelect}
          selectedItems={[]}
          highlightedItems={[]}
          key={foundData.length}
          marked={searchTokens}
        />
      )}
    </div>
  );
}

export { Catalogue };
