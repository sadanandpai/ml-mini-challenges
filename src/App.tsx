import { Router, Route, Switch } from 'wouter';
import { useHashLocation } from 'wouter/use-hash-location';
import { HomePage } from './pages/home';
import { ChallengeView } from './pages/challenge-view';

export function App() {
  return (
    <Router hook={useHashLocation}>
      <Switch>
        <Route path="/" component={HomePage} />
        <Route path="/:name" component={ChallengeView} />
      </Switch>
    </Router>
  );
}
