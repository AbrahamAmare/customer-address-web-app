import app from "./app/index";

const port = process.env.PORT || 6001;
app.listen(port, () => {
  console.log("Environment", process.env.NODE_ENV);
  console.log(`Server is listening on http://localhost:${port}`);
});
