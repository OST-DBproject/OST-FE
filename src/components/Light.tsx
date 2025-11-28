import LightImg from "../assets/lights.svg";

type LightProps = {
    variant: "intro" | "main";
    scrollY?: number;
};

export default function Light({ variant, scrollY = 0 }: LightProps) {

    const introStart = 260;      // 인트로 초기 위치
    const mainTarget = -220;     // 메인에서 고정되는 위치

    const maxScroll = 800;       // 인트로 → 메인 전환 시점(필요하면 조절)
    const progress = Math.min(scrollY / maxScroll, 1);

    const smoothY =
        variant === "intro"
            ? introStart + (mainTarget - introStart) * progress
            : mainTarget;

    const width = variant === "intro" ? 1400 : 1500;
    const blur = variant === "intro" ? 40 : 60;

    return (
        <div
            className="pointer-events-none fixed left-1/2 -translate-x-1/2 z-0"
            style={{
                top: smoothY,
            }}
        >
            <img
                src={LightImg}
                style={{
                    width,
                    filter: `blur(${blur}px)`
                }}
            />
        </div>
    );
}
