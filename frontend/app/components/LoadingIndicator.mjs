const React = window.React;

export const LoadingIndicator = () => {
  return React.createElement('div', {className: 'lds-roller'},
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      React.createElement('div'),
      );
};