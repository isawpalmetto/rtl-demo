import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Thing from "./Thing";

// error is shown with textfield when submitting without a name
test("error message is shown when submitting without a name", async () => {
  render(<Thing />);
  const user = userEvent.setup();
  expect(
    screen.getByRole("textbox", {
      name: /what's your name/i,
    })
  ).toBeInTheDocument();

  await user.click(
    screen.getByRole("button", {
      name: /submit name/i,
    })
  );

  expect(
    screen.getByRole("textbox", { description: /enter your name/i })
  ).toBeInTheDocument();
});

test("name statistics are shown after submitting", async () => {
  // name stats are shown when submitting
  render(<Thing />);
  const user = userEvent.setup();
  const name = screen.getByRole("textbox", {
    name: /what's your name/i,
  });

  await user.type(name, "James");

  await user.click(
    screen.getByRole("checkbox", {
      name: /is this your real name\?/i,
    })
  );

  await user.click(
    screen.getByRole("button", {
      name: /submit name/i,
    })
  );

  // wait for an element to appear
  const stats = await screen.findByRole("region", {
    name: /name information/i,
  });
  expect(stats).toBeInTheDocument();
  expect(within(stats).getByText(/name: james\(real\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted once/i)).toBeInTheDocument();
});

test("submitted name and counts are properly updating in statistics", async () => {
  // submit counts are updating
  render(<Thing />);
  const user = userEvent.setup();
  const name = screen.getByRole("textbox", {
    name: /what's your name/i,
  });
  const submit = screen.getByRole("button", {
    name: /submit name/i,
  });

  await user.type(name, "Owen");
  await user.click(submit);

  // wait for an element to appear
  const stats = await screen.findByRole("region", {
    name: /name information/i,
  });
  expect(stats).toBeInTheDocument();
  expect(within(stats).getByText(/name: owen\(fake\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted once/i)).toBeInTheDocument();

  // new name
  await user.clear(name);
  await user.type(name, "asdf");
  await user.click(submit);
  expect(within(stats).getByText(/name: asdf\(fake\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted: 2 times/i)).toBeInTheDocument();

  await user.click(
    screen.getByRole("checkbox", {
      name: /is this your real name\?/i,
    })
  );

  await user.clear(name);
  await user.type(name, "asdf");
  await user.click(submit);
  expect(within(stats).getByText(/name: asdf\(real\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted: 3 times/i)).toBeInTheDocument();
});
