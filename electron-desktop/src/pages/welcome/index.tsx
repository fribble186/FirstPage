import React from "react";
import "./index.css";
import { motion } from "framer-motion";

const Welcome = () => {
  return (
    <div className="welcome">
      <div className="welcome_content">
        {/* Logo 动画 */}
        <motion.img
          src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="Logo"
          className="welcome_image"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* 文字动画 */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          style={{ whiteSpace: "nowrap" }}
        >
          <span>欢迎使用 FirstPage</span>
        </motion.div>
      </div>
    </div>
  );
};

export default Welcome;
