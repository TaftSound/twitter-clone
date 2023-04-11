import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './HomePage.js';

jest.mock("../PageLayout/PageLayout", () => {
  return ({ centerContent }) => (
    <div data-testid="mocked-page-layout">
      {centerContent.map((content, index) => (
        <div key={index} data-testid={`center-content-${index}`}>
          {content}
        </div>
      ))}
    </div>
  );
});
jest.mock('../NewTweetEntry/NewTweetEntry', () => () => (
  <div data-testid="mocked-new-tweet-entry">Mocked NewTweetEntry</div>
));
jest.mock('../Header/Header', () => () => (
  <div data-testid="mocked-header">Mocked Header</div>
));

describe('HomePage component', () => {
  it('renders without crashing', () => {
    render(<HomePage/>)
  })
  it('Passes correct props to mocked page layout component', () => {
    render(<HomePage/>)
    
    expect(screen.getByTestId('mocked-page-layout')).toBeInTheDocument()
    expect(screen.getByTestId('mocked-new-tweet-entry')).toBeInTheDocument()
    expect(screen.getByTestId('mocked-header')).toBeInTheDocument()
  })
})