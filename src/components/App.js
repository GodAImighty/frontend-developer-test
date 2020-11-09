import React from 'react';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import Contents from './Contents/Contents';
import './styles.css';

export const App = () => {
  return (
    <Container className="app" fixed>
      <Box data-testid="app-box" m={2}>
        <Contents tableType="users" />
        <Contents />
      </Box>
    </Container>
  );
};

export default App;
