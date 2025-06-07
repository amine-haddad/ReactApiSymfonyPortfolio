import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      errorMessage: '',
    };
  }

  static getDerivedStateFromError(error) {
    // Mettre à jour l'état pour indiquer qu'une erreur a été capturée
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Vous pouvez également envoyer l'erreur au service de suivi des erreurs
    console.log('Erreur attrapée:', error);
    console.log('Infos sur l\'erreur:', errorInfo);
    this.setState({
      errorMessage: error.toString(),
    });
  }

  render() {
    if (this.state.hasError) {
      // Retourner un message d'erreur si une erreur est capturée
      return (
        <div>
          <h2>Quelque chose s&apos;est mal passé!</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    // Si aucune erreur, afficher les enfants
    return this.props.children;
  }
}

export default ErrorBoundary;
