import { atom } from 'recoil';

export const currentlyLoggedInState = atom({
  key: 'currentlyLoggedInState',
  default: null,
});

export const roomState = atom({
  key: 'roomState',
  default: [],
});