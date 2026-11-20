"use client"

import { OTPInput, OTPInputGroup, OTPInputSeparator, OTPInputSlot } from "@hashti/react"

export function OTPInputDemo() {
  return (
    <OTPInput maxLength={6} aria-label="Verification code">
      <OTPInputGroup>
        {[0, 1, 2].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
      <OTPInputSeparator>–</OTPInputSeparator>
      <OTPInputGroup>
        {[3, 4, 5].map((index) => (
          <OTPInputSlot key={index} index={index} />
        ))}
      </OTPInputGroup>
    </OTPInput>
  )
}
