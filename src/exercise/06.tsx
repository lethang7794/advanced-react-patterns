// State Reducer
// http://localhost:3000/isolated/exercise/06.tsx

import * as React from 'react'
import {Switch} from '../switch'

function callAll<Args extends Array<unknown>>(
  ...fns: Array<((...args: Args) => unknown) | undefined>
) {
  return (...args: Args) => fns.forEach(fn => fn?.(...args))
}

type ToggleState = {on: boolean}
type ToggleAction =
  | {type: 'toggle'}
  | {type: 'reset'; initialState: ToggleState}

function toggleReducer(state: ToggleState, action: ToggleAction) {
  switch (action.type) {
    case 'toggle': {
      return {on: !state.on}
    }
    case 'reset': {
      return action.initialState
    }
  }
}

// 🐨 add a new option called `reducer` that defaults to `toggleReducer`
function useToggle({initialOn = false, reducer = toggleReducer} = {}) {
  const {current: initialState} = React.useRef<ToggleState>({on: initialOn})
  // 🐨 instead of passing `toggleReducer` here, pass the `reducer` that's
  // provided as an option
  // ... and that's it! Don't forget to check the 💯 extra credit!
  const [state, dispatch] = React.useReducer(reducer, initialState)
  const {on} = state

  const toggle = () => dispatch({type: 'toggle'})
  const reset = () => dispatch({type: 'reset', initialState})

  function getTogglerProps<Props>({
    onClick,
    ...props
  }: {onClick?: React.DOMAttributes<HTMLButtonElement>['onClick']} & Props) {
    return {
      'aria-pressed': on,
      onClick: callAll(onClick, toggle),
      ...props,
    }
  }

  function getResetterProps<Props>({
    onClick,
    ...props
  }: {onClick?: React.DOMAttributes<HTMLButtonElement>['onClick']} & Props) {
    return {
      onClick: callAll(onClick, reset),
      ...props,
    }
  }

  return {
    on,
    reset,
    toggle,
    getTogglerProps,
    getResetterProps,
  }
}

function App() {
  const [timesClicked, setTimesClicked] = React.useState(0)
  const clickedTooMuch = timesClicked >= 4

  const {on, getTogglerProps, getResetterProps} = useToggle({
    reducer: toggleReducer,
    initialOn: false,
  })

  return (
    <div>
      <Switch
        {...getTogglerProps({
          on: on,
          onClick: () => setTimesClicked(count => count + 1),
        })}
      />
      {clickedTooMuch ? (
        <div data-testid="notice">
          Whoa, you clicked too much!
          <br />
        </div>
      ) : timesClicked > 0 ? (
        <div data-testid="click-count">Click count: {timesClicked}</div>
      ) : null}
      <button {...getResetterProps({onClick: () => setTimesClicked(0)})}>
        Reset
      </button>
    </div>
  )
}

export default App

/*
eslint
no-unused-vars: "off",
@typescript-eslint/no-unused-vars: "off",
*/
