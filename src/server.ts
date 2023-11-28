import app from "./app/index";
const portNum = Number.parseInt(process.env.PORT);
const port = portNum || 6001;
app.listen(port, () => {
  console.log("Environment", process.env.NODE_ENV);
  console.log(`Server is listening on http://localhost:${portNum}`);
});
