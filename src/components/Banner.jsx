import BannerImg from "../assets/images/curtain-background.png";
import LogoSvg from "../components/LogoSvg";

const Banner = ({ title }) => {
  return (
    <div className="banner" style={{ "--movie-banner": `url(${BannerImg})` }}>
      <LogoSvg />
      <h2 className="banner-title">{title}</h2>
    </div>
  );
};

export default Banner;
