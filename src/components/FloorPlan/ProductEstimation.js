import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import _, { floor } from "lodash";
import { CircularProgress } from "@mui/material";
import { setInitialProducts } from "../../redux/product";
import MotionButton from "../UI/MotionButton";
import { updateSingleCustomerApi } from "../../redux/customer";

const ProductEstimation = () => {
  const [isProductSaving, setIsProductSaving] = useState(false);
  const selectedProducts = useSelector(
    (state) => state.productReducer.selectedProducts
  );
  const initialProducts = useSelector(
    (state) => state.productReducer.initialProducts
  );
  const singleCustomerData = useSelector(
    (state) => state.customerReducer.singleCustomer
  );
  const dispatch = useDispatch();

  const getSingleItem = useCallback((item, clonedCusomterData) => {
    const scrapRate = item?.Scrap_Rate || null;
    let totalQty = 0;

    const floors = item.floors?.map((floor) => {
      floor.rooms = floor.rooms?.map((room) => {
        const scopeRoom = clonedCusomterData.scope.floors
          .find((f) => f.name === floor.name)
          ?.rooms.find((r) => r.id === room.id);

        let roomQty = scopeRoom?.finalTotalSqFeet || 0;
        roomQty = parseFloat(roomQty?.toFixed(2));

        totalQty += roomQty;
        return {
          ...room,
          quantity: parseFloat(roomQty?.toFixed(2)),
        };
      });

      return floor;
    });

    let qtyWithSR = totalQty * (1 + scrapRate / 100);
    qtyWithSR = parseFloat(qtyWithSR?.toFixed(2));

    return {
      id: item.id,
      name: item.Product_Name,
      quantity: qtyWithSR,
      short_code: item.Short_Code,
      usage_unit: item.Usage_Unit,
      scrapRate: item.Scrap_Rate,
      floors,
    };
  }, []);

  const saveProducts = useCallback(async () => {
    setIsProductSaving(true);
    let clonedCusomterData = _.cloneDeep(singleCustomerData);
    let clonedSelectedProducts = _.cloneDeep(selectedProducts);

    clonedSelectedProducts = clonedSelectedProducts?.reduce((acc, item) => {
      const itemToSend = getSingleItem(item, clonedCusomterData);
      acc.push(itemToSend);
      return acc;
    }, []);

    clonedCusomterData = {
      ...clonedCusomterData,
      all_products: selectedProducts,
      zoho_products: clonedSelectedProducts,
    };

    await dispatch(updateSingleCustomerApi(clonedCusomterData));

    dispatch(setInitialProducts(selectedProducts));
    setIsProductSaving(false);
  }, [singleCustomerData, selectedProducts, setIsProductSaving]);

  const isDataChanged = useMemo(() => {
    return !_.isEqual(initialProducts, selectedProducts);
  }, [initialProducts, selectedProducts]);

  const makeSaveBtnDisable = useMemo(() => {
    return !isDataChanged || isProductSaving;
  }, [isDataChanged, isProductSaving]);

  return (
    <>
      <div
        className="flex justify-center items-center font-bold"
        style={{ height: "calc(100vh - 108px)" }}
      >
        PRODUCT ESTIMATION
      </div>
      <MotionButton
        className={`flex justify-center items-center border-[1px] border-[#1e2e5a] text-black w-full
                ${makeSaveBtnDisable && "bg-gray-400 text-white border-none"}
              `}
        onClick={saveProducts}
        disabled={makeSaveBtnDisable}
      >
        {isProductSaving ? <CircularProgress size={15} /> : "Save"}
      </MotionButton>
    </>
  );
};

export default ProductEstimation;
