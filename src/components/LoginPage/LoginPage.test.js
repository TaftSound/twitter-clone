// LoginPage.test.js
import { render, screen } from "@testing-library/react";
import LoginPage from "./LoginPage";

// Mock the PageLayout component
jest.mock("../PageLayout/PageLayout", () => {
  return ({ centerContent }) => (
    <div data-testid="mock-page-layout">
      {centerContent.map((content, index) => (
        <div key={index} data-testid={`center-content-${index}`}>
          {content}
        </div>
      ))}
    </div>
  );
});

describe("LoginPage", () => {
  it("renders the PageLayout component with the provided centerContent", () => {
    render(<LoginPage />);

    // Check if the mock PageLayout component is rendered
    const pageLayout = screen.getByTestId("mock-page-layout");
    expect(pageLayout).toBeInTheDocument();

    // Check if the centerContent is rendered within the PageLayout component
    const centerContentElement = screen.getByTestId("center-content-0");
    expect(centerContentElement).toBeInTheDocument();
  });
});