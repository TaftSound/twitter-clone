import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './home-page.js';

jest.mock('../page-layout/page-layout', () => {
  return (props) => <div data-testid="mocked-page-layout">{props.centerContent}</div>;
});
jest.mock('./new-tweet-entry', () => () => (
  <div data-testid="mocked-new-tweet-entry">Mocked NewTweetEntry</div>
));
jest.mock('./header', () => () => (
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