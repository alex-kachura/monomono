export function handleResponse({ res, data, next }) {
  return res.format({
    html: () => {
      res.data = {
        ...res.data,
        ...data,
      };

      next();
    },
    json: () => {
      res.send({ ...data });
    },
  });
}
