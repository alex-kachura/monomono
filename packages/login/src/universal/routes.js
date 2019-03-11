import App from './components/app';
import LandingPage from './components/landing';
import EditPage from './components/edit';
import NotFound from './components/not-found';

export default function routesFactory(config, lang) {
  const appPath = `/${config.basePath}/${config.appPath}/${lang}`;
  const routes = [];

  routes.push({
    path: `${appPath}/edit`,
    component: EditPage,
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
  });

  return [
    {
      component: App,
      routes,
    },
  ];
}
