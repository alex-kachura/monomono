import App from './components/app';
import VerifyPage from './components/verify';
import NotFound from './components/not-found';

export default function routesFactory(config, lang) {
  const appPath = `/${config.basePath}/${config.appPath}/${lang}`;
  const routes = [];

  routes.push({
    path: `${appPath}/verify`,
    component: VerifyPage,
    exact: true,
  },
  {
    key: 'NotFound',
    component: NotFound,
  });

  return [
    {
      component: App,
      routes,
    },
  ];
}
