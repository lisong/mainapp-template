import React from 'react'
import './index.less'
import OTPInput from 'react-otp-input'

interface Props {
  handleSubmit?: (code: string) => void;
  numInputs?: number;
  separator?: string;
}

const OtpVerify = (props: Props): JSX.Element => {
  const [{ otp, numInputs, separator, minLength, maxLength, placeholder, inputType }, setConfig] = React.useState({
    otp: '',
    numInputs: props?.numInputs ?? 4,
    separator: props?.separator ?? '-',
    minLength: 0,
    maxLength: 40,
    placeholder: '',
    inputType: 'text' as const
  })

  const handleOTPChange = (otp: string) => {
    setConfig((prevConfig) => ({ ...prevConfig, otp }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    props?.handleSubmit && props?.handleSubmit(otp)
  }

  return <>
    <div className="card">
      <form onSubmit={handleSubmit}>
        <p>Enter verification code</p>
        <div className="margin-top--small">
          <OTPInput
            inputStyle="inputStyle"
            numInputs={numInputs}
            onChange={handleOTPChange}
            renderSeparator={<span>{separator}</span>}
            value={otp}
            placeholder={placeholder}
            inputType={inputType}
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus
          />
        </div>
        <div className="btn-row">
          <button className="btn margin-top--large" disabled={otp.length < numInputs}>
            确认
          </button>
        </div>
      </form>
    </div>
  </>
}

export default OtpVerify
