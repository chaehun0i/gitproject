const Modal = ({ title, children }) => {
  return (
    <section className="modal" aria-label={title}>
      <h2>{title}</h2>
      {children}
    </section>
  );
};

export default Modal;
