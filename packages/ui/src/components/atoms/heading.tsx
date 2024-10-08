import { cn } from "@repo/ui/utils";

interface HeadingProps {
  children: string;
  className?: string;
}

const Heading1: React.FC<HeadingProps> = ({ children, className }) => {
  return (
    <h1
      className={cn("text-primary-foreground font-medium text-4xl", className)}
    >
      {children}
    </h1>
  );
};

const Heading2: React.FC<HeadingProps> = ({ children, className }) => {
  return (
    <h2
      className={cn("text-primary-foreground font-medium text-3xl", className)}
    >
      {children}
    </h2>
  );
};

const Heading4: React.FC<HeadingProps> = ({ children, className }) => {
  return (
    <h4
      className={cn("text-primary-foreground font-medium text-md", className)}
    >
      {children}
    </h4>
  );
};

export { Heading1, Heading2, Heading4 };
