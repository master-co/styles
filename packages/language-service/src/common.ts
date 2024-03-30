import { type ServerCapabilities, TextDocumentSyncKind } from 'vscode-languageserver-protocol'
import { AT_SIGN, DELIMITER_SIGN, SELECTOR_SIGNS, SEPARATOR_SIGN } from '@master/css'

/**
 * First call to trigger syntax hints
 */
export const INVOKED_TRIGGER_CHARACTERS = ['"', ' ', '\'']

/**
 * Trigger value hints
 */
export const VALUE_TRIGGER_CHARACTERS = [SEPARATOR_SIGN, DELIMITER_SIGN]

/**
 * Trigger selector hints
 */
export const SELECTOR_TRIGGER_CHARACTERS = SELECTOR_SIGNS

/**
 * Trigger at hints
 */
export const AT_TRIGGER_CHARACTER = AT_SIGN

/**
 * Trigger group hints
 */
export const GROUP_TRIGGER_CHARACTER = '{'

export const SERVER_CAPABILITIES: ServerCapabilities = {
    textDocumentSync: TextDocumentSyncKind.Incremental,
    // Tell the client that this server supports code completion.
    completionProvider: {
        resolveProvider: false,
        workDoneProgress: false,
        triggerCharacters: [
            ...INVOKED_TRIGGER_CHARACTERS,
            ...VALUE_TRIGGER_CHARACTERS,
            ...SELECTOR_TRIGGER_CHARACTERS,
            ...AT_TRIGGER_CHARACTER,
            ...GROUP_TRIGGER_CHARACTER
        ],
    },
    colorProvider: true,
    hoverProvider: true,
    workspace: {
        workspaceFolders: {
            supported: true
        }
    }
}