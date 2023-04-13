import styled from "styled-components"
import { PRIMARY_COLOR, SEARCH_BAR_BACKGROUND } from "../constants"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import DeleteButton from "./DeleteButton"
import SearchIcon from "./SearchIcon"
import SearchBarInput from "./SearchBarInput"
import SearchSuggestionBox from "./SearchSuggestionBox"


const OuterSearchBarContainer = styled.div`
  position: relative;
  margin: 0px 4px;
  width: 100%;
`

const SearchBarContainer = styled.div`
  position: relative;
  z-index: ${props => props.isFocused ? '2' : '0' };
  width: 100%;
  display: flex;
  align-items: center;
  border-radius: 1000px;
  border: solid 1px transparent;
  border-color: ${props => props.isFocused ? `${PRIMARY_COLOR}` : 'transparent' };
  background-color: ${props => props.isFocused ? 'transparent' : `${SEARCH_BAR_BACKGROUND}` };
`
const SearchBar = (props) => {
  const [inputValue, setInputValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [internalClick, setInternalClick] = useState(false)

  const inputRef = useRef(null)
  const isActiveRef = useRef(false)

  useEffect(() => {
    if (isFocused) {
      const inputElement = inputRef.current
      inputElement.focus()
    }
  }, [isFocused, inputValue])

  useLayoutEffect(() => {

    const mouseDown = () => {
      if (internalClick) {
        if (!isActiveRef.current) {
          isActiveRef.current = true
        }
      } else {
        setIsFocused(false)
        isActiveRef.current = false
      }
    }
    const mouseUp = () => { setIsActive(isActiveRef.current) }

    document.addEventListener('mousedown', mouseDown)
    document.addEventListener('mouseup', mouseUp)

    return () => {
      document.removeEventListener('mousedown', mouseDown)
      document.removeEventListener('mouseup', mouseUp)
    }
  })


  const focusSearchBar = () => { setIsFocused(true) }
  const defocusSearchBar = (event) => { setIsFocused(false) }
  const startInternalClick = () => { setInternalClick(true) }
  const endInternalClick = () => { setInternalClick(false) }

  const updateInputValue = (event) => {
    const newInputValue = event.target.value
    setInputValue(newInputValue)
  }
  const clearInputValue = () => {
    setInputValue("")
    setIsFocused(true)
  }

  return (
    <OuterSearchBarContainer>
      <SearchBarContainer isFocused={isFocused} onMouseDown={startInternalClick} onMouseUp={endInternalClick} >
        <SearchIcon isFocused={isFocused}
                    internalClick={internalClick}
                    onMouseDown={defocusSearchBar}
                    onMouseUp={focusSearchBar} >
        </SearchIcon>
        <SearchBarInput placeholder="Search Tweeter"
                        value={inputValue}
                        onChange={updateInputValue}
                        role="combobox"
                        onFocus={focusSearchBar}
                        isFocused={isFocused}
                        ref={inputRef} >
        </SearchBarInput>
        {(inputValue && isActive) || (inputValue && internalClick)
          ? <DeleteButton internalClick={internalClick} onMouseUp={clearInputValue} />
          : false}
      </SearchBarContainer>
      {isActive || internalClick ? <SearchSuggestionBox></SearchSuggestionBox> : false}
    </OuterSearchBarContainer>
  )
}

export default SearchBar