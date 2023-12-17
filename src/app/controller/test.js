const express = require('express');
const { exec } = require('child_process');

const app = express();

app.get('/getUUID', (req, res) => {
  exec('powershell Get-CimInstance Win32_ComputerSystemProduct | Select-Object UUID', (error, stdout, stderr) => {
    if (error) {
      res.status(500).send(stderr);
    } else {
      res.send(stdout);
    }
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
