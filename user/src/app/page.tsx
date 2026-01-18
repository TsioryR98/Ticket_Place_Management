// Ce fichier sert uniquement de conteneur
import HomePage from './HomePage';

export const revalidate = 3600; // ISR

export default function Page() {
  return <HomePage />;
}
