import { useState, useEffect } from "react";
import { Alert, Button, TextField } from "@cmsgov/ds-healthcare-gov";

function Stats({ name, count, isRealName }) {
  const nameRealText = isRealName ? "(real)" : "(fake)";
  const countText = count > 1 ? `submitted: ${count} times` : "submitted once";
  return (
    <Alert heading="Name Information">
      <div>{`name: ${name}${nameRealText}`}</div>
      <div>{countText}</div>
    </Alert>
  );
}

function Thing() {
  const [name, setName] = useState("");
  const [isRealName, setIsRealName] = useState();
  const [nameStats, setNameStats] = useState({
    submittedName: "",
    nameChangedCount: 0,
  });
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const { submittedName, submittedRealName, nameChangedCount } = nameStats;

  useEffect(() => {
    // remove error message if name was updated
    if (name && errorMessage) {
      setErrorMessage("");
    }
  }, [name, errorMessage]);

  const handleNameCheck = (e) => {
    setIsRealName(e.target.checked);
  };

  return (
    <>
      <header className="ds-l-container">
        <h1>RTL Example</h1>
      </header>
      <div role="main" className="ds-l-container">
        <TextField
          className="ds-u-margin-bottom--2"
          onChange={(e) => setName(e.currentTarget.value)}
          name="tfield"
          label="What's your name"
          value={name}
          errorMessage={errorMessage}
        />
        <div className="ds-u-margin-bottom--2">
          <label htmlFor="name-id">
            <span className="ds-u-visibility--screen-reader">
              Is this your{" "}
            </span>
            real name?
          </label>
          <input
            onChange={handleNameCheck}
            type="checkbox"
            name="name-checkbox"
            id="name-id"
          />
        </div>
        <Button
          name="button"
          className="ds-u-margin-bottom--2"
          label="button"
          onClick={() => {
            if (name) {
              setHasSubmitted(true);
              setNameStats((prevState) => ({
                submittedName: name,
                nameChangedCount: prevState.nameChangedCount + 1,
                submittedRealName: isRealName,
              }));
            } else {
              setErrorMessage("Enter your name");
            }
          }}
        >
          Submit<span className="ds-u-visibility--screen-reader"> Name</span>
        </Button>
        {hasSubmitted && (
          <Stats
            name={submittedName}
            count={nameChangedCount}
            isRealName={submittedRealName}
          />
        )}
      </div>
    </>
  );
}

export default Thing;
