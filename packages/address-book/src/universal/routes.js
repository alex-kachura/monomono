import App from './components/app';
import LandingPage from './components/landing';
import AddDeliveryAddress from './components/add-delivery-address';
import EditDeliveryAddress from './components/edit-delivery-address';
import ClubcardAddress from './components/clubcard-address';
import NotFound from './components/not-found';

export default function routesFactory(config, lang) {
  const appPath = `/${config.basePath}/${config.appPath}/${lang}`;
  const routes = [];

  routes.push(
    {
      path: `${appPath}/add-delivery-address`,
      component: AddDeliveryAddress,
      exact: true,
    },
    {
      path: `${appPath}/edit-delivery-address`,
      component: EditDeliveryAddress,
      exact: true,
    },
    {
      path: `${appPath}/edit-clubcard-address`,
      component: ClubcardAddress,
      exact: true,
    },
    {
      path: appPath,
      component: LandingPage,
      exact: true,
    },
    {
      key: 'NotFound',
      component: NotFound,
    },
  );

  return [
    {
      component: App,
      routes,
    },
  ];
}
