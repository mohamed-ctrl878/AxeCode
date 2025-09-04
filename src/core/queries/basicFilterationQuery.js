import {stringify} from "qs";

export const basicFilterationQuery = ({
  filterkey,
  filterVal,
  populateVal,
  isFilter,
  start,
  limit,
  isPopulate,
}) => {
  const query = stringify(
    {
      ...(isFilter && {
        filters: {
          [filterkey]: {
            $containsi: filterVal,
          },
        },
      }),
...( isPopulate &&{
      populate: populateVal}),
      sort: ["createdAt:desc"],
      pagination: {
        start: 0,
        limit: limit,
      },
    },
    { encodeValuesOnly: true }
  );

  return query;
};
