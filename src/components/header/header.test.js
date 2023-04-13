import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "./Header";
import { act } from "react-dom/test-utils";

describe("Header component", () => {
  it("renders title header", () => {
    render(<Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following" ]} />)
    expect(screen.getByText("Home")).toBeInTheDocument()
  });

  it("renders two NavButton components with correct titles", () => {
    render(<Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following" ]} />)
    const navButtons = screen.getAllByRole("button")
    expect(navButtons.length).toBe(2)
    expect(navButtons[0]).toHaveTextContent("For you")
    expect(navButtons[1]).toHaveTextContent("Following")
  });

  it("shows correct default tab on first render", () => {
    render(<Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following" ]} />)
    const focusedNavButton = screen.getByTestId("focused-tab")
    expect(focusedNavButton.textContent).toBe("For you")
  });

  it("Switches to different tab when clicked", () => {
    render(<Header titleHeader="Home" defaultTab="For you" tabsArray={["For you", "Following" ]} />)
    const followingButton = screen.getAllByRole("button")[1]
    // eslint-disable-next-line testing-library/no-unnecessary-act
    act(() => {
      userEvent.click(followingButton)
    })
    
    const focusedNavButton = screen.getByTestId("focused-tab")
    expect(focusedNavButton.textContent).toBe("Following")
  });
});
