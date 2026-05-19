export function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function getBookKey(title: string, author: string) {
  return `${normalizeText(title)}:${normalizeText(author)}`;
}

export function getStudentKey(name: string, grade: string) {
  return `${normalizeText(name)}:${grade.trim()}`;
}
