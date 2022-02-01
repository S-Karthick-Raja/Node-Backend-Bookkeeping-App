const errorMiddlewareHandler = (error, req, res, next) => {
//   set status code
const errorStatusCode = res.statusCode === 200 ? 500 : res.statusCode;
res.status(errorStatusCode);
res.json({
    message: error.message,
});
};

module.exports = {errorMiddlewareHandler};