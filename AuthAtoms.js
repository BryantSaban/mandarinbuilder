import { atom } from "recoil";

export const isAdminState = atom({
    key: "isAdminState",
    default: true, // Force admin access
});

export const isTeacherState = atom({
    key: "isTeacherState",
    default: true, // Force teacher access
});
