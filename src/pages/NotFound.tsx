import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="card max-w-md w-full p-8 text-center">
        <div className="mx-auto mb-4 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan">
          <Compass size={26} />
        </div>
        <p className="text-5xl font-bold text-slate-100 tracking-tight">404</p>
        <h1 className="mt-2 text-lg font-semibold text-slate-200">Off the map</h1>
        <p className="mt-1 text-sm text-slate-400">
          That page isn&apos;t in our orbit. Try one of the navigation links.
        </p>
        <Link to="/" className="btn btn-primary mt-5">
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
