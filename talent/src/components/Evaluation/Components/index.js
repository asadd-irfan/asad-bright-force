import React from "react";
import Developer from "./Developer";
import NonDeveloper from "./NonDeveloper";

import { useSelector } from "react-redux";

function Evaluation() {

  const user = useSelector(state => state.auth.user);

  return (
    <>
      {user && user.isDeveloper && <Developer />}
      {user && !user.isDeveloper && <NonDeveloper />}
    </>
  );
}

export default Evaluation;
