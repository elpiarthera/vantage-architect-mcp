import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleToggle } from "../../src/ui/components/LocaleToggle.js";

describe("<LocaleToggle>", () => {
  it("toggles EN → FR", () => {
    const onChange = vi.fn();
    render(<LocaleToggle locale="en" onChange={onChange} />);
    const btn = screen.getByRole("switch");
    expect(btn).toHaveAttribute("aria-checked", "false");
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith("fr");
  });

  it("toggles FR → EN", () => {
    const onChange = vi.fn();
    render(<LocaleToggle locale="fr" onChange={onChange} />);
    const btn = screen.getByRole("switch");
    expect(btn).toHaveAttribute("aria-checked", "true");
    fireEvent.click(btn);
    expect(onChange).toHaveBeenCalledWith("en");
  });
});
