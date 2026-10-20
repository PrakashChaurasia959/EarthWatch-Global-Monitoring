import { Component, type ReactNode } from 'react';

interface State {
  hasError: boolean;
  message?: string;
}

/** Catch render-time errors so a single bad component doesn't blank the app. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(err: unknown): State {
    return { hasError: true, message: err instanceof Error ? err.message : 'Unexpected error' };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('EarthWatch error boundary caught:', error, info);
  }

  handleReset = () => this.setState({ hasError: false, message: undefined });

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="card max-w-lg w-full p-6 text-center">
            <div className="text-accent-rose/80 mx-auto mb-3" aria-hidden="true">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 9v4M12 17h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-slate-100">Something broke</h1>
            <p className="text-sm text-slate-400 mt-1">
              An unexpected error occurred while rendering this view. {this.state.message}
            </p>
            <button className="btn btn-primary mt-4" onClick={this.handleReset}>
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
