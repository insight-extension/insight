export const convertToBaseUnits = ({
    decimals,
    value,
}: {
    decimals: number;
    value: number;
}) => {
    const factor = 10 ** decimals;

    return value * factor;
};
