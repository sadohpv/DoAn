import routesConfig from "./config";

const publicRoutes = [routesConfig.login, routesConfig.signup];

// Private Route
const privateRoutes = [routesConfig.home, routesConfig.user,];

export { publicRoutes, privateRoutes };
