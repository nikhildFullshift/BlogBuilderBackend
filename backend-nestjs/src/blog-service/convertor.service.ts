export const bigIntTypeConverter = async (result) => {
  let updatedData = JSON.stringify(result, (_key, value) =>
    typeof value === 'bigint' ? Number(value) : value,
  );
  updatedData = JSON.parse(updatedData);
  return updatedData;
};
