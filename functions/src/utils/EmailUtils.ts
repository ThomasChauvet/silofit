export class EmailUtils {
  public readonly isEmailValid = (emailLike: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLike);
  public readonly getDomain = (emailLike: string): string | null =>
    this.isEmailValid(emailLike) ? emailLike.split("@")[1] : null;
}

export const emailUtils = new EmailUtils();
