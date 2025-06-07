import HomePage from '../components/pages/HomePage';
import NotFound from '../pages/NotFound';

const routes = {
  tasks: {
    component: HomePage,
    label: 'My Tasks',
    icon: 'CheckSquare',
    path: '/'
  },
  archive: {
archive: {
    id: 'archive',
    label: 'Archive',
    icon: 'Archive',
    component: HomePage,
    path: '/archive'
  }
};

export const routeArray = Object.values(routes);
export default routes;