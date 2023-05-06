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

export const errorMessageState = atom({
  key: 'errorMessageState',
  default: '',
})

export const roomDetailsState = atom({
  key: 'roomDetailsState',
  default: {
    room_name: '',
    date_of_event: '',
    time_of_event: '',
  },
});

export const isFriendsState = atom({
  key:'isFriendsState',
  default: [],
})

export const searchTermState = atom({
  key:'searchTermState',
  default: '',
})

export const resultsState = atom({
  key:'resultsState',
  default: [],
})

export const friendUsernamesState = atom({
  key:'friendUsernamesState',
  default: [],
})

export const eventElementState = atom({
  key:'eventElementState',
  default: '',
})

export const eventValueState = atom({
  key:'eventValueState',
  default: '',
})

export const eventElementsState = atom({
  key:'eventElementsState',
  default: [],
})

export const isDeletedState = atom({
  key:'isDeletedState',
  default: [],
})

export const showCardsState = atom({
  key:'showCardsState',
  default: true,
})

export const isParticipantState = atom({
  key:'isParticipantState',
  default: [],
})

export const showCardState = atom({
  key:'showCardState',
  default: true,
})