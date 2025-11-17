import { stringify } from "qs";

export const querySearchingUserIdintify = ({ username, email }) =>
  stringify(
    {
      filters: {
        $or: [{ username: { $eq: username } }, { email: { $eq: email } }],
      },
    },
    { encodeValuesOnly: true }
  );
