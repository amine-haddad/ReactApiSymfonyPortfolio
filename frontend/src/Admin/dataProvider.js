import jsonServerProvider from "ra-data-simple-rest";

const dataProvider = jsonServerProvider("http://localhost:8000/api"); // ou ton API Symfony
export default dataProvider;
