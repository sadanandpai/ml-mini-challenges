import { useParams } from 'wouter';
import { challenges } from '../helpers/challengesList';
import { Navbar } from '../components/navbar';

export function ChallengeView() {
  const params = useParams<{ name: string }>();
  const challenge = challenges.find((c) => c.name === params.name);

  if (!challenge) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold">Challenge not found</h1>
        <a href="/" className="btn btn-link">
          Go back home
        </a>
      </div>
    );
  }

  const { component: Component, title } = challenge;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar title={title} />
      <div className="container mx-auto p-4 flex justify-center">
        <Component />
      </div>
    </div>
  );
}
