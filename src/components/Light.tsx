import LightImg from "../assets/lights.svg";

type LightProps = {
    variant: "intro" | "main" | "home";
    scrollY?: number;
};

export default function Light({ variant, scrollY = 0 }: LightProps) {

    if (variant === "home") {
        return (
            <div
                className="pointer-events-none fixed z-0"
                style={{
                    top: "-100px",
                    right: "-650px",
                }}
            >
                <img
                    src={LightImg}
                    style={{
                        filter: "blur(50px)",
                        opacity: 0.9,
                    }}
                />
            </div>
        );
    }


    const introStartY = 260;
    const mainTargetY = -220;
    const maxScroll = 800;

    const progress = Math.min(scrollY / maxScroll, 1);

    const yPos =
        variant === "intro"
            ? introStartY + (mainTargetY - introStartY) * progress
            : mainTargetY;

    const size = variant === "intro" ? 1400 : 1500;
    const blur = variant === "intro" ? 40 : 60;

    return (
        <div
            className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-0"
            style={{ top: yPos }}
        >
            <img
                src={LightImg}
                style={{
                    width: size,
                    filter: `blur(${blur}px)`
                }}
            />
        </div>
    );
}
