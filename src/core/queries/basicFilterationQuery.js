import {stringify} from "qs";

export const basicFilterationQuery = ({
  filterkey,
  filterVal,
  populateVal,
  isFilter,
  start,
  limit,
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

      populate: populateVal,
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
