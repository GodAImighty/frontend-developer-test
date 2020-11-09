import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  TableSortLabel,
} from '@material-ui/core';

import api from '../../lib/api';

const Contents = ({ tableType }) => {
  const [fetchingData, setFetchingData] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [sortDirection, setSortDirection] = useState('desc');

  const sortItems = (direction, dataToSort) => {
    // change sort direction and sort items
    if (direction === 'desc') {
      dataToSort.sort((a, b) => {
        // desc
        return b.timestamp - a.timestamp;
      });
    } else {
      dataToSort.sort((a, b) => {
        // asc
        return a.timestamp - b.timestamp;
      });
    }
  };

  const fetchData = async () => {
    setError(null);
    try {
      let result;
      if (tableType === 'users') {
        result = await api.getUsersDiff();
      } else {
        result = await api.getProjectsDiff();
      }
      setFetchingData(false);
      if (result.code === 200) {
        sortItems(sortDirection, result.data);
        setData(result.data);
      } else {
        setError(result.error);
      }
    } catch (e) {
      setFetchingData(false);
      setError(e.error);
    }
  };

  // we only want to fetch data on mount
  // so eslint is disabled
  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line

  const createData = (date, userId, oldValue, newValue) =>
    ({ date, userId, oldValue, newValue });

  const rows = data.map(datum => {
    const date = new Date(datum.timestamp);
    const dateString = date.toISOString().split('T')[0];
    const diff = datum.diff[0];

    return createData(dateString, datum.id, diff.oldValue, diff.newValue)
  });
  
  return (
    <TableContainer component={Paper} className="data-table">
      {Boolean(data.length) && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortDirection}>
                <TableSortLabel
                  direction={sortDirection}
                  onClick={() => {
                    const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                    setSortDirection(newDirection);
                    sortItems(newDirection, data);
                  }}
                >
                  Date
                </TableSortLabel>
              </TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Old value</TableCell>
              <TableCell>New value</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <TableRow key={i}>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.oldValue}</TableCell>
                <TableCell>{row.newValue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div className="extra-things">
        {error && (
          <Typography
            color="error"
            className="error"
            gutterBottom
            variant="subtitle2"
          >
            We had problems fetching your data. Please try again.
          </Typography>
        )}
        {fetchingData ? (
          <CircularProgress className="loading-spinner" />
        ) : (
          <Button
            className="button"
            variant="contained"
            color="primary"
            disableElevation
            onClick={() => {
              setFetchingData(true);
              fetchData();
            }}
          >
            {error ? 'Retry' : 'Load more'}
          </Button>
        )}
      </div>
    </TableContainer>
  );
}

export default Contents;
