// Language (CG Prompt 09D Section 8). Training delivered in a language someone
// does not read comfortably is not training, and an acknowledgment signed against
// a document they could not read is a hollow record. The field is built into the
// schema now even though everything ships in English, because retrofitting
// multilingual content into a system that assumed one language means rebuilding
// the acknowledgment record. What matters more than the translation itself is the
// field that records which language a document was displayed in.

// Ships English only. Not a closed set: more languages can be added without a
// migration, so the type stays a plain code rather than a union.
export type LanguageCode = string;

export const DEFAULT_LANGUAGE: LanguageCode = 'en';
export const SHIPPED_LANGUAGES: LanguageCode[] = ['en'];

// The console reports anyone whose preferred language is not one the assigned
// content exists in. Their assignment is not a defensible record until the
// content exists in a language they read.
export function languageMismatch(preferred: LanguageCode, availableLanguages: LanguageCode[]): boolean {
  return !availableLanguages.includes(preferred);
}

export function peopleWithLanguageGap(
  people: { personId: string; preferred: LanguageCode }[],
  availableLanguages: LanguageCode[],
): string[] {
  return people.filter((p) => languageMismatch(p.preferred, availableLanguages)).map((p) => p.personId);
}
