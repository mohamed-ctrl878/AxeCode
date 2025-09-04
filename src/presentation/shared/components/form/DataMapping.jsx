import { checkLength } from "@core/utils/problemUploader/validation";
import { useValidateInputEffect } from "@presentation/shared/hooks/useValidateInputEffect";
import { set } from "date-fns";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DataMapping = ({
  setError,
  dataSetter,
  data,
  Component,
  probertyItem,
  storeName,
}) => {
  const ItemFromStore = useSelector((state) => state[storeName][probertyItem]);
  // console.log(storeName, "storeName");
  // console.log(probertyItem, "probertyIatem");
  // console.log(ItemFromStore, "ItemFromStore");
  const [selectors, setSelectors] = useState(ItemFromStore);
  const dispatch = useDispatch();
  useValidateInputEffect({
    value: selectors,
    fieldName: probertyItem,
    validationFunc: checkLength,
    setError: setError,
    dispatch: dispatch,
    condition: selectors.length > 0,
    errorMessage: "please sellect a week/s",
    setProberty: dataSetter,
    currentFieldValue: ItemFromStore,
  });
  return Array.isArray(data)
    ? data.map((element, index) => (
        <Component element={element} index={index} setData={setSelectors} />
      ))
    : null;
};

export default DataMapping;
