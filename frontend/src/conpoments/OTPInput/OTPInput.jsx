import React, { useState } from "react";

const OTPInput = () => {
  const [values, setValues] = useState(["", "", "", "", "", ""]);

  const handleChange = (e, index) => {
    const newValue = e.target.value;
    const newValues = [...values];

    // Mettre à jour la valeur pour le champ d'index donné
    newValues[index] = newValue.slice(0, 1); // Limiter à 1 caractère
    setValues(newValues);

    // Passer automatiquement au prochain champ si une valeur est entrée
    if (newValue && index < values.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      // Revenir au champ précédent si la valeur actuelle est vide
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  return (
    <div className="opt_input mt-20">
      {values.map((value, index) => (
        <input
          key={index}
          id={`otp-input-${index}`}
          type="text"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className="otp-box"
        />
      ))}
    </div>
  );
};

export default OTPInput;
