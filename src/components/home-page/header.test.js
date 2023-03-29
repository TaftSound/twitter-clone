import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./header.js";
import { act } from "react-dom/test-utils";

describe("Header component", () => {
  it("renders Home as header", () => {
    render(<Header />)
    expect(screen.getByText("Home")).toBeInTheDocument()
  });

  it("renders two NavButton components with correct titles", () => {
    render(<Header />)
    const navButtons = screen.getAllByRole("button")
    expect(navButtons.length).toBe(2)
    expect(navButtons[0]).toHaveTextContent("For you")
    expect(navButtons[1]).toHaveTextContent("Following")
  });

  it("shows 'for you' as current user location by default", () => {
    render(<Header />)
    const navButtons = screen.getAllByTestId("underline")
    expect(navButtons[0]).toHaveClass('visible')
    expect(navButtons[1]).not.toHaveClass('visible')
  });

  it("switches to 'following' as current user location when 'following' button clicked", () => {
    render(<Header />)
    const followingButton = screen.getAllByRole("button")[1]
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(followingButton)
    })
    
    const navButtons = screen.getAllByTestId("underline")
    expect(navButtons[0]).not.toHaveClass('visible')
    expect(navButtons[1]).toHaveClass('visible')
  });
  it("switches back to 'for you' as current user location when 'for you' button clicked", () => {
    render(<Header />)
    const forYouButton = screen.getAllByRole("button")[0]
    const followingButton = screen.getAllByRole("button")[1]
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(followingButton)
      userEvent.click(forYouButton)
    })
    
    const navButtons = screen.getAllByTestId("underline")
    expect(navButtons[0]).toHaveClass('visible')
    expect(navButtons[1]).not.toHaveClass('visible')
  });
});
