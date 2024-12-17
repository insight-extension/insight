import {
    LucideProps,
    X,
    AlertCircleIcon,
    Loader,
    Circle,
    Check,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const IconsList = {
    x: X,
    alertCircleIcon: AlertCircleIcon,
    loader: Loader,
    circle: Circle,
    check: Check,
    chevronDown: ChevronDown,
    chevronUp: ChevronUp,
};

export type IconName = keyof typeof IconsList;

interface IconProps extends LucideProps {
    name: IconName;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
    const LucideIcon = IconsList[name];

    return <LucideIcon {...props} />;
};
