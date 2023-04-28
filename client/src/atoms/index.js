import { atom } from 'recoil';

export const isLoadingState = atom({
  key: 'isLoadingState',
  default: true,
})

export const currentlyLoggedInState = atom({
  key: 'currentlyLoggedInState',
  default: null,
});

export const roomState = atom({
  key: 'roomState',
  default: [],
});

export const showPasswordState = atom({
  key: 'showPasswordState',
  default: false,
});

export const eventFormState = atom({
  key: 'eventFormState',
  default: {
    room_name: '',
    date_of_event: '',
    time_of_event: '',
  },
});

export const showFormState = atom({
  key: 'showFormState',
  default: false,
})