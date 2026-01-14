import './Button.css';

const Button = ({ type = 'primary', onClick, children, disabled = false, ...props }) => {
  const buttonClass = `btn btn-${type}`;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;

