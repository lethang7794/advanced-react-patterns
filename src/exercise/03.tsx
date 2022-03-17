// Flexible Compound Components
// http://localhost:3000/isolated/exercise/03.tsx

import * as React from 'react'
import {Switch} from '../switch'

type ToggleContextType = {on: boolean; toggle: () => void}
const ToggleContext = React.createContext<ToggleContextType | undefined>(
  undefined,
)
ToggleContext.displayName = 'ToggleContext'

const useToggle = () => {
  const context = React.useContext(ToggleContext)
  if (!context) {
    throw new Error('useToggle must be called within <Toggle />')
  }
  return context
}

function Toggle({children}: {children: React.ReactNode}) {
  const [on, setOn] = React.useState(false)
  const toggle = () => setOn(!on)

  return (
    <ToggleContext.Provider value={{on, toggle}}>
      {children}
    </ToggleContext.Provider>
  )
}

function ToggleOn({children}: {children: React.ReactNode}) {
  const {on} = useToggle()
  return <>{on ? children : null}</>
}

function ToggleOff({children}: {children: React.ReactNode}) {
  const {on} = useToggle()
  return <>{on ? null : children}</>
}

function ToggleButton(
  props: Omit<React.ComponentProps<typeof Switch>, 'on' | 'onClick'>,
) {
  const {on, toggle} = useToggle()
  return <Switch on={on} onClick={toggle} {...props} />
}

function App() {
  return (
    <div>
      <Toggle>
        <ToggleOn>The button is on</ToggleOn>
        <ToggleOff>The button is off</ToggleOff>
        <div>
          <ToggleButton />
        </div>
      </Toggle>
    </div>
  )
}

export default App

/*
eslint
  no-unused-vars: "off",
  @typescript-eslint/no-unused-vars: "off",
*/
