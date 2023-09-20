import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Thing from "./Thing";

test("page renders the form", () => {
  render(<Thing />);
  // textbox
  expect(
    screen.getByRole("textbox", {
      name: /what's your name/i,
    })
  ).toBeInTheDocument();
  // checkbox
  expect(
    screen.getByRole("checkbox", {
      name: /is this your real name\?/i,
    })
  ).toBeInTheDocument();
  // button
  expect(
    screen.getByRole("button", {
      name: /submit name/i,
    })
  ).toBeInTheDocument();
});
// error is shown with textfield when submitting without a name
test("error message is shown when submitting without a name", async () => {
  render(<Thing />);
  const user = userEvent.setup();

  //  click button
  await user.click(
    screen.getByRole("button", {
      name: /submit name/i,
    })
  );
  // verify error is shown
  expect(
    screen.getByRole("textbox", { description: /enter your name/i })
  ).toBeInTheDocument();
  // verify that error is removed when entering name

  await user.type(
    screen.getByRole("textbox", {
      name: /what's your name/i,
    }),
    "hi"
  );

  expect(
    screen.queryByRole("textbox", { description: /enter your name/i })
  ).not.toBeInTheDocument();
});

test("name statistics are shown after submitting", async () => {
  render(<Thing />);
  const user = userEvent.setup();
  const nameBox = screen.getByRole("textbox", {
    name: /what's your name/i,
  });
  const checkBox = screen.getByRole("checkbox", {
    name: /is this your real name\?/i,
  });
  const submit = screen.getByRole("combobox", {
    name: /submit /i,
  });
  // enter name
  await user.type(nameBox, "James");
  // click checkbox
  await user.click(checkBox);
  // submit
  await user.click(submit);
  // verify stats are shown
  const stats = screen.getByRole("region", {
    name: /name information/i,
  });
  expect(stats).toBeInTheDocument();
  expect(within(stats).getByText(/name: james\(real\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted once/i)).toBeInTheDocument();

  // test updates
  await user.clear(nameBox);
  await user.type(nameBox, "Owen");
  await user.click(checkBox);
  await user.click(submit);

  expect(within(stats).getByText(/name: owen\(fake\)/i)).toBeInTheDocument();
  expect(within(stats).getByText(/submitted: 2 times/i)).toBeInTheDocument();
});
