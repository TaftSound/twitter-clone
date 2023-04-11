/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import NewTweetEntry from "./NewTweetEntry";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

describe("NewTweetEntry", () => {
  test("renders the user's initial correctly", () => {
    render(<NewTweetEntry userName="John Doe" />);

    expect(screen.getByTestId("user-initial").textContent).toBe('J');
  });

  test("renders the AudienceSelector button when focused", () => {
    render(<NewTweetEntry userName="John Doe" />);
    const input = screen.getByRole('textbox')

    act(() => {
      userEvent.click(input)
    })

    expect(screen.getByTestId("audience-selector")).toBeInTheDocument();
  });

  test("renders the Tweet input element", () => {
    render(<NewTweetEntry userName="John Doe" />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test("renders the WhoCanReply element when focused", () => {
    render(<NewTweetEntry userName="John Doe" />);

    const input = screen.getByRole('textbox')

    act(() => {
      userEvent.click(input)
    })

    expect(screen.getByTestId("who-can-reply")).toBeInTheDocument();
  });

  test("renders the submit Tweet button", () => {
    render(<NewTweetEntry userName="John Doe" />);

    expect(screen.getByTestId("submit-tweet")).toBeInTheDocument();
  });

  test("updates the input value when typing", () => {
    render(<NewTweetEntry userName="John Doe" />);
    const input = screen.getByRole("textbox");

    act(() => {
      userEvent.click(input)
      userEvent.keyboard("Hello, world!")
    })
    expect(input.value).toBe("Hello, world!");
  });

});