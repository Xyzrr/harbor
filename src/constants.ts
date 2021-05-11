import Color from 'color';
import * as Colyseus from 'colyseus.js';

export const MAX_INTERACTION_DISTANCE = 192;
export const PLAYER_RADIUS = 16;

export const DARK_BACKGROUND = Color('#191919');
export const LIGHT_BACKGROUND = Color('#262626');
export const HIGHLIGHT = Color(`rgb(0, 216, 41)`);
export const DANGER = Color(`rgb(253, 50, 74)`);

export const HOST = process.env.LOCAL
  ? 'localhost:5000'
  : 'virtual-office-server.herokuapp.com';

export const COLOR_OPTIONS = [
  0x800000,
  0xe6194b,
  0xf58231,
  0xffe119,
  0xbcf60c,
  0xaaffc3,
  0x46f0f0,
  0xe6beff,
  0xf032e6,
  0x911eb4,

  0xfffac8,
  0xffd8b1,
  0xfabebe,
  0x008080,
  0x4363d8,
  0x3cb44b,
  0x808080,
  0x9a6324,
  0x808000,
  0x000075,
];

export const COLYSEUS_CLIENT = new Colyseus.Client(`ws://${HOST}`);
