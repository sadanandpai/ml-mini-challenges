import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomePage } from './pages/home';
import { challenges } from './pages/home';

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={HomePage} />
        {challenges.map(({ name, component: Component }) => (
          <Route key={name} path={`/${name}`}>
            <Component />
          </Route>
        ))}
      </Switch>
    </Router>
  );
}
