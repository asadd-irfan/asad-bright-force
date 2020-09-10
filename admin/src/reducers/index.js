import { combineReducers } from "redux";
import auth from "./auth";
import talents from "./talents";
import company from "./company";
import talentManager from "./talentManager";
import positions from "./positions";
import settings from "./settings";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

export default persistReducer(
  {
    key: "rrsb", // key is required
    storage, // storage is now required
    whitelist: ["auth"],
  },
  combineReducers({
    auth,
    talents,
    company,
    talentManager,
    positions,
    settings,
  })
);
