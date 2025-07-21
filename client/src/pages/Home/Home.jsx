import { motion } from "framer-motion";
import Button from '@mui/material/Button';
import SchoolIcon from '@mui/icons-material/School';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center"
      >
        <SchoolIcon sx={{ fontSize: 80, color: "#FFD700" }} />
        <h1 className="text-5xl font-extrabold mt-6">🏫 Welcome to SmartSchool</h1>
        <p className="mt-4 text-xl text-gray-300">
          Experience the next generation of school management with cutting-edge technology.
        </p>
        <div className="mt-8 space-x-4">
          <Button variant="contained" color="primary" size="large">
            Get Started
          </Button>
          <Button variant="outlined" color="secondary" size="large">
            Learn More
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
