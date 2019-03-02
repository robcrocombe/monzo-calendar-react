import React from 'react';

interface Props {
  visible: boolean;
  close: () => void;
  title: string;
  body: React.ReactNode;
  footer: React.ReactNode;
}

export function Modal(props: Props) {
  return (
    <div className={props.visible ? 'modal is-active' : 'modal'}>
      <div className="modal-background" onClick={props.close} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{props.title}</p>
          <button className="delete" aria-label="close" onClick={props.close} />
        </header>
        <section className="modal-card-body">{props.body}</section>
        <footer className="modal-card-foot">{props.footer}</footer>
      </div>
    </div>
  );
}
