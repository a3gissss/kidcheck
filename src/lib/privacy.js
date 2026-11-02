export const MAX_TEXT = 1000

// Seven or more digits in a row (spaces, dashes or a leading +) looks like a
// phone number. Clinical numbers in a description are much shorter.
export function looksLikePhoneNumber(text) {
  return /\+?(?:\d[\s-]?){7,}/.test(text)
}

// Why a description cannot be sent to the AI yet, or '' when it can.
export function aiTextError(text) {
  if (!text.trim()) return 'Write a description first, or fill the checklist yourself.'
  if (looksLikePhoneNumber(text)) return 'This looks like a phone number. Remove it before sending the description to AI.'
  return ''
}
