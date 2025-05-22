import * as LucideIcons from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { createLucideIcon, ...IconsList } = LucideIcons;

type IconsType = Exclude<keyof typeof IconsList, keyof typeof createLucideIcon>;

interface IconProps extends LucideProps {
  name: IconsType;
}

export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = IconsList[name] as LucideIcon;

  return <LucideIcon {...props} />;
};

export type { IconsType as IconName };
