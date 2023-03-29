import { useState } from "react";

import PropTypes from 'prop-types';

function NavButton(props) {
  return (
    <div className={props.title} data-testid={props.title} role="button" onClick={() => props.setCurrentViewState(props.title)} >
      <h2>{props.title}</h2>
      <div 
        className={props.currentViewState === props.title ? "underline visible" : "underline"}
        data-testid="underline" >
      </div>
    </div>
  )
}

NavButton.propTypes = {
  title: PropTypes.string.isRequired,
  currentViewState: PropTypes.string.isRequired,
  setCurrentViewState: PropTypes.func.isRequired
}

const Header = (props) => {

  const [currentViewState, setCurrentViewState] = useState('For you')

  return (
    <div className="home-header" data-testid="home-header">
      <h1>Home</h1>
      <div className="nav-buttons">
        <NavButton title="For you" currentViewState={currentViewState} setCurrentViewState={setCurrentViewState}/>
        <NavButton title="Following" currentViewState={currentViewState} setCurrentViewState={setCurrentViewState}/>
      </div>
    </div>
  )
}

export default Header
