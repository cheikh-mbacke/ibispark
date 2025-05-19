import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour afficher l'UI de secours
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez aussi enregistrer l'erreur dans un service de reporting
    console.error("Erreur capturée par la boundary :", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      // Vous pouvez rendre n'importe quelle UI de secours
      return (
        <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
            Une erreur est survenue
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Quelque chose s'est mal passé. Veuillez réessayer ou contacter
            l'assistance si le problème persiste.
          </p>
          <details className="bg-white dark:bg-gray-800 p-4 rounded-md mt-4">
            <summary className="text-red-600 dark:text-red-400 cursor-pointer">
              Détails techniques (pour les développeurs)
            </summary>
            <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-900 rounded overflow-auto text-xs">
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            onClick={() => window.location.reload()}
          >
            Recharger la page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
