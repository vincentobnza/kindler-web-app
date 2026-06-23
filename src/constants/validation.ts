/**
 * Form validation rules and messages. Keep limits/regexes here so inputs,
 * tests and (eventually) the backend contract reference the same values.
 */

export const VALIDATION_RULES = {
  search: {
    minLength: 2,
    maxLength: 96,
  },
} as const

export const VALIDATION_MESSAGES = {
  required: "This field is required.",
  tooShort: (min: number) => `Must be at least ${min} characters.`,
  tooLong: (max: number) => `Must be ${max} characters or fewer.`,
} as const
