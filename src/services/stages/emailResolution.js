import {resolveEmail} from "../providers/prospeo";

export async function emailResolution(person) {
    if(!person) return [];
    return await resolveEmail(person);
}