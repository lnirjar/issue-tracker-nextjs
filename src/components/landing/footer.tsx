export const Footer = () => {
  return (
    <footer className="border-t mt-12 pt-6 text-center text-sm text-muted-foreground">
      <p>
        Built with ❤️ by{" "}
        <a
          href="https://nirjar.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Nirjar Lohakare
        </a>
      </p>
      <div className="flex justify-center gap-4 mt-2">
        <a
          href="https://linkedin.com/in/nirjar-com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          LinkedIn
        </a>
        <a
          href="https://github.com/lnirjar"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary transition-colors"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};
