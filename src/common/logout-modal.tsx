import React from 'react';
import { Modal } from './modal';

interface Props {
  visible: boolean;
  submit: () => void;
  close: () => void;
}

export function LogoutModal(props: Props) {
  return (
    <Modal
      title="Are you sure?"
      visible={props.visible}
      close={props.close}
      body={
        <div className="content">
          <p>Logging out will remove all saved data.</p>
        </div>
      }
      footer={
        <React.Fragment>
          <button className="button" onClick={props.close}>
            Cancel
          </button>
          <button className="button is-primary" onClick={props.submit}>
            Log out
          </button>
        </React.Fragment>
      }
    />
  );
}
