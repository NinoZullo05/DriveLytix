# Implementation Plan - Security Hardening

This plan addresses security vulnerabilities identified during the audit, primarily focusing on insecure storage of authentication tokens.

## User Review Required

> [!IMPORTANT]
> Change from `AsyncStorage` to `react-native-keychain` for `authToken` storage. This is a breaking change for existing local sessions as they will need to re-authenticate or be migrated.

## Proposed Changes

### Mobile App - Secure Storage

#### [MODIFY] [SettingsService.ts](file:///c:/Users/nizu/Documents/ReactNative/DriveLytix/mobile/src/core/services/SettingsService.ts)

- Remove `authToken` from `UserSettings` interface and `AsyncStorage` persistence.
- Implement a new `SecureStorageService` or integrate `react-native-keychain` to handle the `authToken` separately.
- Update `loadSettings`, `updateSettings`, and `clearSettings` to use the secure storage for the token.

### Backend - Security Headers

#### [MODIFY] [index.ts](file:///c:/Users/nizu/Documents/ReactNative/DriveLytix/backend/src/index.ts)

- Add `helmet` middleware for security headers.
- Implement rate limiting to prevent brute-force attacks on potential endpoints.

## Verification Plan

### Automated Tests

- Run `npm test` in the mobile directory to ensure existing settings logic still works (after mocking keychain).
- Verify build success after adding new dependencies.

### Manual Verification

1. Login to the app and verify the token is stored.
2. Inspect `AsyncStorage` (via Flipper or logs) to ensure the token is NO LONGER present there.
3. Verify the token persists across app restarts using the secure storage.
