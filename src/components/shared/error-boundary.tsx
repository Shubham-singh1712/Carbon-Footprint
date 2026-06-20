"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallbackTitle?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[CarbonTwin ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="p-8 text-center" role="alert">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-danger/10 text-danger">
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          <h3 className="mt-5 text-xl font-semibold text-foreground">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted">
            An unexpected error occurred. Try refreshing or contact support if the
            problem persists.
          </p>
          {this.state.error ? (
            <p className="mt-3 rounded-lg bg-background-strong px-4 py-2 font-mono text-xs text-muted">
              {this.state.error.message}
            </p>
          ) : null}
          <Button
            className="mt-6"
            variant="secondary"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
