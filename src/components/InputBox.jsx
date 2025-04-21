import React, { useState } from 'react';
import { motion } from 'framer-motion';

function InputBox({ value, onChange, placeholder }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div 
      className="input-group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.25, 
        ease: "easeOut",
        delay: 0,
        type: "tween"
      }}
    >
      <motion.label 
        htmlFor="input-text" 
        className="input-label"
        initial={{ opacity: 0.8 }}
        animate={{ opacity: 1, color: isFocused ? '#A78BFA' : '#8B5CF6' }}
        transition={{ duration: 0.2 }}
      >
        Input
      </motion.label>
      <motion.textarea
        id="input-text"
        rows={4}
        className="textarea"
        placeholder={placeholder || "Paste code, error messages, or text here..."}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        whileFocus={{ 
          boxShadow: "0 0 0 2px rgba(139, 92, 246, 0.3), 0 0 15px rgba(139, 92, 246, 0.2)" 
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
}

export default InputBox; 