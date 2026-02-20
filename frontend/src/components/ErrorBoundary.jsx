import React from 'react';
import { Button, Container, Card } from './UI';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
                    <Container className="max-w-md">
                        <Card className="text-center p-8 border-red-100 shadow-xl shadow-red-100/20">
                            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                                <AlertTriangle size={32} />
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h1>
                            <p className="text-slate-600 mb-8">
                                We encountered an unexpected error while preparing your support tools. Please try again or return home.
                            </p>

                            <div className="space-y-3">
                                <Button
                                    onClick={this.handleReset}
                                    className="w-full bg-slate-900 text-white rounded-xl py-4 flex items-center justify-center gap-2"
                                >
                                    <RefreshCw size={18} /> Refresh Page
                                </Button>
                                <Button
                                    variant="ghost"
                                    onClick={() => window.location.href = '/'}
                                    className="w-full text-slate-600 flex items-center justify-center gap-2"
                                >
                                    <Home size={18} /> Return Home
                                </Button>
                            </div>

                            {process.env.NODE_ENV === 'development' && (
                                <div className="mt-8 p-4 bg-slate-100 rounded-lg text-left text-xs font-mono text-red-700 overflow-auto max-h-40">
                                    {this.state.error?.toString()}
                                </div>
                            )}
                        </Card>
                    </Container>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
