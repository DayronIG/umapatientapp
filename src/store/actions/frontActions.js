export function modalOpen(action) {
  return {
      type: 'OPEN_MODAL',
      payload: true,
      action: action
  }
}

export function modalClose() {
  return {
      type: 'CLOSE_MODAL',
      payload: true
  }
}

export function appointAction(payload) {
  return {
    type: 'SET_APPOINT_ACTION',
    payload: payload
  }
}