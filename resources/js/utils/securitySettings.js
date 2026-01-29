export const SECURITY_SETTING_KEYS = {
    rememberMasterPassword: 'keynest.rememberMasterPassword',
    masterPasswordSession: 'keynest.masterPassword',
};

export function getRememberMasterPassword() {
    return window.localStorage.getItem(SECURITY_SETTING_KEYS.rememberMasterPassword) === 'true';
}

export function setRememberMasterPassword(remember) {
    window.localStorage.setItem(
        SECURITY_SETTING_KEYS.rememberMasterPassword,
        remember ? 'true' : 'false'
    );

    if (!remember) {
        clearSessionMasterPassword();
    }
}

export function getSessionMasterPassword() {
    return window.sessionStorage.getItem(SECURITY_SETTING_KEYS.masterPasswordSession);
}

export function setSessionMasterPassword(password) {
    window.sessionStorage.setItem(SECURITY_SETTING_KEYS.masterPasswordSession, password);
}

export function clearSessionMasterPassword() {
    window.sessionStorage.removeItem(SECURITY_SETTING_KEYS.masterPasswordSession);
}
