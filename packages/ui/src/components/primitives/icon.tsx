
import React from "react";

import {
  type LucideProps,
  X,
  AlertCircleIcon,
  Loader,
  Circle,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Sidebar,
  CircleX,
  Languages,
  Play,
  Square,
  Clock,
  Download,
  ListCollapse
} from "lucide-react";

const IconsList = {
  X,
  AlertCircleIcon,
  Loader,
  Circle,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Sidebar,
  CircleX,
  Languages,
  Play,
  Square,
  Clock,
  Download,
  ListCollapse
};

export type IconName = keyof typeof IconsList;

interface IconProps extends LucideProps {
  name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = IconsList[name];

  return <LucideIcon {...props} />;
};
