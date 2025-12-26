import { stringify } from "qs";

export const courseQuery = () => {
  return stringify(
    {
      populate: {
        picture: true,
        weeks: {
          populate: {
            lessons: {
              populate: {
                video: true,
              },
            },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );
};
