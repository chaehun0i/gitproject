const Card = ({ title, children }) => {
  return (
    <article className="card">
      {title ? <h2>{title}</h2> : null}
      {children}
    </article>
  );
};

export default Card;
