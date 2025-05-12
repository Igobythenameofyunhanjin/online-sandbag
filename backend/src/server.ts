import dotenv from 'dotenv';
dotenv.config();  // Must be the very first line

import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
