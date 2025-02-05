import {atom} from "recoil"

export const userInfoAtom = atom({
    key: "userAtom", // unique key for this atom
    default: null,    // initial state
})