import { Button, notification } from 'antd';
import { FileInfo, Result } from "../interfaces";
import { faker } from '@faker-js/faker';
export function randomFileInfo(): FileInfo {
    return {
        id: faker.string.sample(7),
        name: faker.person.firstName(),
        lastSave: 0,
        lastUpdate: 0,
        isDeleted: false,
        isNew: false
    }
}

export function toastError() {
    notification.error({
        message: 'Notification Title',
        description: 'This is the content of the notification. You can customize it.',
    });
}

export function randomInt(min: number, max: number) {
    // Generate a random floating-point number between 0 and 1
    const random = Math.random();

    // Scale the random number to fit within the range [min, max]
    const scaledRandom = random * (max - min + 1);

    // Use Math.floor to round down to the nearest integer
    const randomNumber = Math.floor(scaledRandom + min);

    return randomNumber;
}

export function loop(times: number, callback: (i: number) => void) {
    for (let i = 0; i < times; i++) {
        callback(i)
    }
}
export function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getAccessTokenCookies() {
    return localStorage.getItem("google_access_token")
}
export function setAccessTokenCookies(token: string) {
    localStorage.setItem("google_access_token", token)
}
export function getTokenCookies() {
    return localStorage.getItem("token")
}
export function setTokenCookies(token: string) {
    localStorage.setItem("token", token)
}
export function randomValue<A, B>(a: A, b: B) {
    return Math.random() > 0.5 ? a : b
}

export function showResultMessage(result: Result) {

    notification.error({ message: result.errorMessage, description: result.statusCode })
}

export const DEFAULT_FILE_INFO: FileInfo = {
    id: '',
    name: '',
    lastSave: 0,
    lastUpdate: 0,
    isNew: false,
    isDeleted: false
}

export function isOk(result:Result) {
    return (result.statusCode >= 200 && result.statusCode <= 299)
}