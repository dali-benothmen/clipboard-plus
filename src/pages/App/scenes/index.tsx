import React from 'react';
import History from './History';

export enum Scenes {
  HISTORY = 'History',
  INSIGHTS = 'Insights',
  TRASH = 'Trash',
  SETTINGS = 'Settings',
}

export type Scene =
  | Scenes.HISTORY
  | Scenes.INSIGHTS
  | Scenes.TRASH
  | Scenes.SETTINGS;

const AppScene = ({ scene }: { scene: Scene }) => {
  switch (scene) {
    case Scenes.HISTORY:
      return <History />;
    case Scenes.INSIGHTS:
      return <div>Insights page is under construction.</div>;
    case Scenes.TRASH:
      return <div>Trash page is under construction.</div>;
    case Scenes.SETTINGS:
      return <div>Settings page is under construction.</div>;
    default:
      return <div>Unknown scene.</div>;
  }
};

export default AppScene;
