export default function generateInitials(word: string) {
    const characters = word.split('');
    const initials = characters
      .filter((char) => /[a-zA-Z]/.test(char))
      .slice(0, 2)
      .map((char) => char.toUpperCase())
      .join('');
    return initials;
  }