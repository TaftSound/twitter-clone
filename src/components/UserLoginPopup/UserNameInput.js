import styled from "styled-components";
import { useState } from "react";
import { ALERT_RED, DIVIDER_COLOR, FONT_FAMILY, MAIN_FONT_COLOR, PRIMARY_COLOR, SECONDARY_FONT_COLOR } from "../constants";
import { useRef } from "react";
import { useLayoutEffect } from "react";
import PubSub from "pubsub-js";
import { useEffect } from "react";

const NameInputContainer = styled.div`
  position: relative;
  display: flex;
  border: solid 1px ${DIVIDER_COLOR};
  border-radius: 4px;
  margin: 12px 0px;
`;
const LabelOuterContainer = styled.div`
  position: absolute;
  z-index: 2;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;
const FocusBorder = styled.div`
  position: absolute;
  z-index: 2;
  top: -2px;
  right: -2px;
  bottom: -2px;
  left: -2px;
  border: ${props => props.isFocused ? `solid 2px ${PRIMARY_COLOR}` : 'none'};
  border-radius: 5px;
`;
const LabelInnerContainer = styled.div`
  padding: ${props => props.isFocused || props.textContent ? '4px 10px 0px' : '16px 10px 0px'};
  transition: padding 150ms;
`;
const Label = styled.label`
  font-size: ${props => props.isFocused || props.textContent ? '14px' : '18px'};
  color: ${props => props.isFocused ? `${PRIMARY_COLOR}` : `${SECONDARY_FONT_COLOR}`};
  transition: font-size, color, 150ms;
`;
const InputContainer = styled.div`
  margin: 16px 0px 0px;
  padding: 12px 10px 8px;
  width: 100%;
`;
const Input = styled.input`
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  height: 20px;
  width: 100%;
  background-color: transparent;
  border: none;
  outline: none;
  font-family: ${FONT_FAMILY};
  font-size: 18px;
  font-weight: 500;
  padding: 0px;
  color: ${MAIN_FONT_COLOR};
`;
const AlertMessage = styled.p`
  position: absolute;
  top: -21px;
  right: -10px;
  width: max-content;
  margin: 0px;
  font-size: 14px;
  color: ${ALERT_RED};
`

export const UserNameInput = (props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [alertText, setAlertText] = useState("")

  const inputRef = useRef(null);
  const formNameRef = useRef(props.form)

  const focusInput = () => {
    setIsFocused(true);
  };

  const defocusInput = () => {
    setAlertText('')
    setIsFocused(false)
  }

  useLayoutEffect(() => {
    const userNameRequiredToken = PubSub.subscribe('alert username required', () => {
      setAlertText('Username required *')
    })
    const userNameTakenToken = PubSub.subscribe('alert username taken', () => {
      setAlertText('User name is taken *')
    })
    const userNameCharactersToken = PubSub.subscribe('alert username characters', () => {
      setAlertText('No spaces or special characters allowed *')
    })
    const focusInputToken = PubSub.subscribe('focus username input', (msg, data) => {
      if (formNameRef.current === data) { setIsFocused(true) }
    })
    const clearAlertToken = PubSub.subscribe('clear username alert', () => {
      setAlertText('')
    })

    return () => {
      PubSub.unsubscribe(userNameRequiredToken)
      PubSub.unsubscribe(userNameTakenToken)
      PubSub.unsubscribe(userNameCharactersToken)
      PubSub.unsubscribe(focusInputToken)
      PubSub.unsubscribe(clearAlertToken)
    }
  }, [])

  useEffect(() => {
    if (isFocused) {
      const input = inputRef.current;
      input.focus();
    }
  }, [isFocused])

  const changeFunction = (event) => {
    setAlertText('')
    props.onChange(event)
  }

  return (
    <NameInputContainer onClick={focusInput} isFocused={isFocused}>
      <FocusBorder isFocused={isFocused}></FocusBorder>
      <LabelOuterContainer isFocused={isFocused}>
        <LabelInnerContainer isFocused={isFocused} textContent={props.value}>
          {props.guest
            ? <Label isFocused={isFocused} textContent={props.value} htmlFor="username-input">Guest Username</Label>
            : <Label isFocused={isFocused} textContent={props.value} htmlFor="username-input">Choose username:</Label>}
        </LabelInnerContainer>
      </LabelOuterContainer>
      <InputContainer>
        <Input ref={inputRef} name="username-input" value={props.value} onChange={changeFunction} onBlur={defocusInput}></Input>
      </InputContainer>
      <AlertMessage>{alertText}</AlertMessage>
    </NameInputContainer>
  );
};
