import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import PageLayout from "./PageLayout";


jest.mock('../LeftSidebar/LeftSidebar.js', () => () => <div data-testid="left-sidebar">Mocked Left Sidebar</div> )
jest.mock('../RightSidebar/RightSidebar.js', () => () => <div data-testid="right-sidebar">Mocked Right Sidebar</div> )

describe("PageLayout component", () => {
  it('renders without crashing', () => {
    render(<PageLayout centerContent={ [<div>Center Content</div>] } />)
  })
  it('renders center content passed by props', () => {
    render(<PageLayout centerContent={ [<div>Center Content</div>] } />)
    expect(screen.getByText('Center Content')).toBeInTheDocument()
  })
  it('renders multiple centerContent items', () => {
    render(<PageLayout centerContent={ [<div>Center Content</div>, <div>Next Center Content</div>] } />)
    expect(screen.getByText('Center Content')).toBeInTheDocument()
    expect(screen.getByText('Next Center Content')).toBeInTheDocument()
  })
  it('renders left and right sidebars', () => {
    render(<PageLayout centerContent={ [<div>Center Content</div>] } />)
    expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('right-sidebar')).toBeInTheDocument();
  })
})