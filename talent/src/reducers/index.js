import { combineReducers } from "redux";
import auth from "./auth";
import talentCalendar from "./talentCalendar";
import invites from "./invites";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export default persistReducer(
  {
    key: "rrsb", // key is required
    storage, // storage is now required
    whitelist: ["auth"],
  },
  combineReducers({ auth, talentCalendar, invites })
);
