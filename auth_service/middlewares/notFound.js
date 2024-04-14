const notFound = (req, res, next) => {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);

  //   const err = new Error("Not Found");
  //   err.status = 404;
  //   if (req.path.split("/").includes("admin") && err.status == 404) {
  //     res.redirect("/page-not-found");
  //   } else {
  //     res
  //       .status(err.status)
  //       .json({
  //         type: "error",
  //         message: "the url you are trying to reach is not hosted on our server",
  //       });
  //     next(err);
  //   }
};

export default notFound;
