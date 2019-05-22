import App from './components/app';
import VerifyPage from './components/verify';
import NotFound from './components/not-found';

export default function routesFactory(config, lang, tests) {
  const appPath = `/${config.basePath}/${config.appPath}/${lang}`;
  const routes = [];

  if (tests && tests.verify.segment === 'enabled') {
    routes.push({
      path: `${appPath}/verify`,
      component: VerifyPage,
      exact: true,
    });
  }

  routes.push({
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
