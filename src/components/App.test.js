import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';
import Contents from './Contents/Contents';

describe('<App />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<App />);
  });

  describe('render()', () => {
    it('renders the Box', () => {
      expect(wrapper.find({ 'data-testid': 'app-box' })).toHaveLength(1);
    });

    it('renders two <Contents /> components', () => {
      expect(wrapper.find(Contents)).toHaveLength(2);
    })
  });
});
