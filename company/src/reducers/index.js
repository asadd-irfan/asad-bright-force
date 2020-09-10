import { combineReducers } from "redux";
import auth from "./auth";
import company from "./company";
import positions from "./positions";
import talents from "./talents";
import notifications from "./notifications";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export default persistReducer(
  {
    key: "rrsb", // key is required
    storage, // storage is now required
    whitelist: ["auth"],
  },
  combineReducers({ auth, company, positions, talents, notifications })
);
