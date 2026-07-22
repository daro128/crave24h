import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/image copy 28.png";

const Logo = ({
  to,
  imgClassName = "w-9 h-9",
  textClassName = "text-[#004953] text-xl",
  className = "",
  imgWrapperClassName = "",
}) => {
  const navigate = useNavigate();

  const image = (
    <img className={`${imgClassName} object-contain`} src={logoImg} alt="C24h logo" />
  );

  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className={`flex items-center gap-2 cursor-pointer ${className}`}
    >
      {imgWrapperClassName ? (
        <span className={`flex items-center justify-center shrink-0 ${imgWrapperClassName}`}>
          {image}
        </span>
      ) : (
        image
      )}
      <span className={`${textClassName} font-bold tracking-tight`}>C24h</span>
    </button>
  );
};

export default Logo;
