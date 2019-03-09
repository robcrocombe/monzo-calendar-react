import React, { useState, useRef, useEffect } from 'react';
import { Modal } from './modal';

interface Props {
  visible: boolean;
  submit: (form: AuthForm) => void;
  close: () => void;
}

export interface AuthForm {
  clientId: string;
  clientSecret: string;
}

export function AuthModal(props: Props) {
  const redirectUrl = process.env.REDIRECT_URL;
  const clientIdField = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<AuthForm>(defaultFormData());

  useEffect(() => {
    if (props.visible) {
      clientIdField.current.focus();
    } else {
      setForm(defaultFormData());
    }
  }, [props.visible]);

  const [invalidForm, setInvalidForm] = useState(true);

  useEffect(() => {
    setInvalidForm(!(form.clientId.trim() && form.clientSecret.trim()));
  }, [form]);

  function handleChange(event: React.FormEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    setForm({
      ...form,
      [target.name]: target.value,
    });
  }

  const body = (
    <div onKeyDown={e => e.key === 'Enter' && props.submit(form)}>
      <div className="content">
        <p>
          You will need to create an OAuth client (non-confidential) in the{' '}
          <a href="https://developers.monzo.com">Monzo developer tools</a> to use this app with your
          Monzo account.
        </p>
        <p>
          Use <code>{redirectUrl}</code> as the Redirect URL.
        </p>
      </div>
      <div className="field mt2">
        <label className="label" htmlFor="clientId">
          Client ID
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="clientId"
            ref={clientIdField}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={form.clientId}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="field mb2">
        <label className="label" htmlFor="clientSecret">
          Client Secret
        </label>
        <div className="control">
          <input
            className="input"
            type="text"
            name="clientSecret"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={form.clientSecret}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );

  const footer = (
    <React.Fragment>
      <button
        className="button is-primary"
        onClick={() => props.submit(form)}
        disabled={invalidForm}
      >
        Login
      </button>
      <button className="button" onClick={props.close}>
        Cancel
      </button>
    </React.Fragment>
  );

  return (
    <Modal title="Login" visible={props.visible} close={props.close} body={body} footer={footer} />
  );
}

function defaultFormData(): AuthForm {
  return {
    clientId: '',
    clientSecret: '',
  };
}
