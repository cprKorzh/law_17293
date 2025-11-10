export default function Heading({
    children,
    additionalStyle,
}: {
    children: string;
    additionalStyle?: string;
}) {
    return (
        <div className="mb-8 space-y-0.5">
            <h2
                className={`text-xl font-semibold tracking-tight ${additionalStyle}`}
            >
                {children}
            </h2>
        </div>
    );
}
