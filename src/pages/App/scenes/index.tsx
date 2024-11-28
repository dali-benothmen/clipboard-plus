import React from 'react';
import History from './History';
import Trash from './Trash';
import Insights from './Insights';

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
      return <Insights />;
    case Scenes.TRASH:
      return <Trash />;
    case Scenes.SETTINGS:
      return <div>Settings page is under construction.</div>;
    default:
      return <div>Unknown scene.</div>;
  }
};

export default AppScene;
