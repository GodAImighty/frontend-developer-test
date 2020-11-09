import React from 'react';
import { shallow, mount } from 'enzyme';
import { CircularProgress, TableRow, Typography } from '@material-ui/core';
import { act } from 'react-dom/test-utils';
import Contents from './Contents';
import { getProjectsDiff } from '../../lib/api';

jest.mock('../../lib/api', () => ({
  getUsersDiff: jest.fn(),
  getProjectsDiff: jest.fn(),
}));

describe('<Contents />', () => {
  let wrapper;

  it('Shows loading state', () => {
    wrapper = shallow(<Contents />);
    expect(wrapper.find(CircularProgress)).toHaveLength(1);
  });

  it('Shows populated state', async () => {
    getProjectsDiff.mockImplementationOnce(() => ({
      code: 200,
      data: [{
        timestamp: '123',
        id: 'bloop',
        diff: [{
          oldValue: 'boop',
          newValue: 'beep',
        }],
      }],
    }));

    await act(async () => {
      wrapper = mount(<Contents />);
    })
    wrapper.update();

    expect(wrapper.find(TableRow)).toHaveLength(2);
    expect(wrapper.find(CircularProgress)).toHaveLength(0);
  });

  it('Shows error state', async () => {
    getProjectsDiff.mockImplementationOnce(() => {
      // throw error in expected form
      // eslint-disable-next-line no-throw-literal
      throw ({ error: 'bad' });
    });

    await act(async () => {
      wrapper = mount(<Contents />);
    })
    wrapper.update();

    expect(wrapper.find(Typography)).toHaveLength(1);
  });
});
