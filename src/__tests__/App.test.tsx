import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Routes from '../Routes';

describe('Routes', () => {
  it('should render', () => {
    expect(render(<Routes />)).toBeTruthy();
  });
});
