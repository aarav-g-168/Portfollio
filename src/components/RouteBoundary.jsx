import { Component } from 'react';

export default class RouteBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="resume-loading route-error" role="alert">
      <h1>This page couldn’t load.</h1>
      <p>A connection issue or a recent site update may have interrupted loading. Reload to try again.</p>
      <button type="button" onClick={() => window.location.reload()}>Reload page</button>
      <a href="/">Back to portfolio</a>
    </main>;
  }
}
