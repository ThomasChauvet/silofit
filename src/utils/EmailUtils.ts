class EmailUtils {
    // TODO: Setup a more robust email validation pattern
    public static isEmailValid = (emailLike: string): boolean => /(.+)@(.+){2,}\.(.+){2,}/.test(emailLike);
    public static getDomain = (emailLike: string): string => emailLike.split('@')[1];
}

export default EmailUtils;
