import styled from 'styled-components'
import PubSub from 'pubsub-js'
import PropTypes from 'prop-types'
import LeftSidebar from "../LeftSidebar/LeftSidebar"
import uniqid from 'uniqid'

import { PageLayoutContainer, 
         LeftSidebarContainer,
         ContentContainer,
         CenterContainer,
         RightContainer,
         SubContainer,
         SidebarScrollContent, 
         SidebarSearchContainer } from "./StyledContainers"
import React from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import { useState } from 'react'


const structureContent = (elementArray) => {
  const structuredElements = elementArray.map((element) => {
    return <SubContainer key={uniqid()}>{element}</SubContainer>
  })
  return structuredElements
}

const PageLayout = (props) => {
  const scrollableRef = useRef(null)
  const centerContentRef = useRef(null)
  const rightSidebarRef = useRef(null)
  const sidebarPositionRef = useRef(0)

  useEffect(() => {
    const scrollable = scrollableRef.current
    const centerContent = centerContentRef.current
    const rightSidebar = rightSidebarRef.current

    const handleScroll = () => {
      if (!scrollable) { return }
      const previousScrollTop = scrollable.prevScrollTop || 0
      const scrollTop = scrollable.scrollTop
      scrollable.prevScrollTop = scrollTop      

      window.requestAnimationFrame(() => {
        // Scroll center content
        centerContent.style.top = `${-scrollTop}px`

        // Scroll sidebar
        const sidebarScrollLength = rightSidebar.clientHeight - window.innerHeight;
        const scrollChange = scrollTop - previousScrollTop
        sidebarPositionRef.current = sidebarPositionRef.current + scrollChange

        if(sidebarPositionRef.current < 0) { sidebarPositionRef.current = 0 }
        if(sidebarPositionRef.current > sidebarScrollLength) { sidebarPositionRef.current = sidebarScrollLength }

        rightSidebar.style.top = `${-sidebarPositionRef.current}px`;
      })
    }

    scrollable.addEventListener('scroll', handleScroll)

    const unsubToken = PubSub.subscribe('tweet image loaded', () => {

    })

    return () => {
      scrollable.removeEventListener('scroll', handleScroll)
      PubSub.unsubscribe(unsubToken)
    }
  }, [])

  return (
    <PageLayoutContainer ref={scrollableRef}>
      <LeftSidebarContainer>{<LeftSidebar/>}</LeftSidebarContainer>
      <ContentContainer>
        <CenterContainer>
          {props.header}
          <SubContainer ref={centerContentRef}>
            {props.centerContent && structureContent(props.centerContent)}
          </SubContainer>
        </CenterContainer>
        <RightContainer>
          <SidebarSearchContainer>
            <SearchBar sidebar={true}></SearchBar>
          </SidebarSearchContainer>
          <SidebarScrollContent ref={rightSidebarRef}>
            {props.sidebarContent && structureContent(props.sidebarContent)}
          </SidebarScrollContent>
        </RightContainer>
      </ContentContainer>
    </PageLayoutContainer>
  )
}

PageLayout.propTypes = {
  centerContent: PropTypes.array
}


export default PageLayout