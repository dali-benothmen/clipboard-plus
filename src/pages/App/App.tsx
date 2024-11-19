import React from 'react';
import './App.css';

interface Props {
  title: string;
}

const App: React.FC<Props> = ({ title }: Props) => {
  return <div className="app-container">{title} Page</div>;
};

export default App;
