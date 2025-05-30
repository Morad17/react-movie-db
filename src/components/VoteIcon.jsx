import { GiRoundStar } from "react-icons/gi";

const VoteIcon = ({ vote }) => {
  return (
    <div className="vote-number" style={{ position: "relative" }}>
      <span
        className="star-fill-wrapper"
        style={{
          position: "relative",
          display: "inline-block",
          width: "3em",
          height: "3em",
          verticalAlign: "middle",
        }}
      >
        {/* Gray background star */}
        <GiRoundStar
          style={{
            color: "gray",
            fontSize: "3em",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        />
        {/* Gold foreground star, clipped to percentage */}
        <span
          style={{
            width: `${vote * 10}%`,
            overflow: "hidden",
            display: "inline-block",
            position: "absolute",
            top: 0,
            left: 0,
            height: "100%",
            pointerEvents: "none",
          }}
        >
          <GiRoundStar style={{ color: "gold", fontSize: "3em" }} />
        </span>

        <p
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            margin: 0,
            color: "black",
            fontWeight: "bold",
            fontSize: "16px",
            pointerEvents: "none",
          }}
        >
          {vote?.toFixed(1)}
        </p>
      </span>
    </div>
  );
};

export default VoteIcon;
