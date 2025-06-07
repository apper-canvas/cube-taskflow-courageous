import Home from '../pages/Home';
import NotFound from '../pages/NotFound';

const routes = {
  tasks: {
    id: 'tasks',
    label: 'My Tasks',
    icon: 'CheckSquare',
    component: Home,
    path: '/'
  },
  archive: {
    id: 'archive',
    label: 'Archive',
    icon: 'Archive',
    component: Home,
    path: '/archive'
  }
};

export const routeArray = Object.values(routes);
export default routes;